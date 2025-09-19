param(
  [string]$ConfigPath = "./codex-autosession.json"
)

function Read-Json($path) {
  if (!(Test-Path $path)) { throw "Config not found: $path" }
  return Get-Content $path -Raw | ConvertFrom-Json
}

function Run($exe, $args, $cwd) {
  Push-Location $cwd
  try {
    $output = & $exe @args 2>&1
    $code = $LASTEXITCODE
    $text = ($output | Out-String).TrimEnd()
    return @{ code = $code; out = $text }
  } finally {
    Pop-Location
  }
}

function Git-CommitPush($repo, $message) {
  $status = Run 'git' @('status','--porcelain') $repo
  if (-not $status.out.Trim()) { return 'Nothing to commit.' }

  $resultTexts = @()
  foreach ($command in @(
      @{ exe = 'git'; args = @('add','-A') },
      @{ exe = 'git'; args = @('commit','-m',$message) },
      @{ exe = 'git'; args = @('push') }
    )) {
    $res = Run $command.exe $command.args $repo
    $resultTexts += $res.out
    if ($res.code -ne 0) { break }
  }

  return ($resultTexts -join "`n").TrimEnd()
}

$cfg = Read-Json $ConfigPath
$REPO = $cfg.repo_dir
if (!(Test-Path $REPO)) { throw "Repo dir not found: $REPO" }

$codexCmd = 'codex'
if (-not (Get-Command $codexCmd -ErrorAction SilentlyContinue)) {
  throw 'codex CLI not found in PATH.'
}

Write-Host "[codex-autosession] repo=$REPO model=$($cfg.model) reasoning=$($cfg.reasoning) approvals=$($cfg.approvals) sandbox=$($cfg.sandbox)"

function Invoke-Codex($prompt, $cfg, $cmd) {
  $args = @('exec', '-C', $cfg.repo_dir)

  if ($cfg.PSObject.Properties.Name -contains 'model' -and $cfg.model) {
    $args += @('-m', $cfg.model)
  }

  if ($cfg.PSObject.Properties.Name -contains 'approvals' -and $cfg.approvals) {
    if ($cfg.approvals -eq 'full') {
      $args += '--full-auto'
    } else {
      $args += @('-a', $cfg.approvals)
    }
  }

  if ($cfg.PSObject.Properties.Name -contains 'sandbox' -and $cfg.sandbox) {
    $args += @('-s', $cfg.sandbox)
  }

  if ($cfg.PSObject.Properties.Name -contains 'reasoning' -and $cfg.reasoning) {
    $args += @('-c', "reasoning=`"$($cfg.reasoning)`"")
  }

  $args += $prompt

  Write-Host "[codex-autosession] running: $cmd $($args -join ' ')"
  & $cmd @args
  return @{ code = $LASTEXITCODE }
}

$cycle = 1
while ($true) {
  if (Test-Path (Join-Path $REPO 'codex.stop')) {
    Write-Host 'Stop file detected. Exiting.'
    break
  }

  Write-Host "`n--- Cycle $cycle started at $(Get-Date -Format 'u')"

  $prompt = $cfg.cycle_prompt + "`n`n" +
            'If Auto-Agents.md/Auto-Remember.md/Auto-Memory.md exist, read them first. Keep diffs tight and run tests. If tests pass, conclude.'

  $result = Invoke-Codex $prompt $cfg $codexCmd
  if ($result.code -ne 0) { break }

  $commitOut = Git-CommitPush $REPO $cfg.commit_message
  if ($commitOut) { Write-Host $commitOut }

  $status = Invoke-Codex '/status' $cfg $codexCmd
  if ($status.code -ne 0) { break }

  $cycle += 1
  Start-Sleep -Seconds 2
}

