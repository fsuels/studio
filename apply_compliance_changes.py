from pathlib import Path
path = Path("src/app/api/compliance/reports/route.ts")
text = path.read_text(encoding="utf-8")

insert_anchor = "interface ComplianceReport {\r\n  id: string;\r\n  title: string;\r\n  description: string;\r\n  generatedAt: string;\r\n  reportType: string;\r\n  metrics: Record<string, any>;\r\n  recommendations: string[];\r\n  complianceLevel: 'compliant' | 'partial' | 'non-compliant';\r\n}\r\n\r\n"
if insert_anchor not in text:
    raise SystemExit('Anchor for type insertion not found')
new_types = (
    "type ComplianceMetrics = ReturnType<typeof analyzeComplianceMetrics>;\r\n\r\n"
    "interface DetailedComplianceReport {\r\n"
    "  reportInfo: {\r\n"
    "    type: string;\r\n"
    "    generatedAt: string;\r\n"
    "    scope: 'user_specific' | 'system_wide';\r\n"
    "    userId: string;\r\n"
    "  };\r\n"
    "  complianceMetrics: ComplianceMetrics;\r\n"
    "  auditEvents: any[];\r\n"
    "  userData: Array<Record<string, unknown>> | null;\r\n"
    "  recommendations: string[];\r\n"
    "  certifications: {\r\n"
    "    gdpr: ReturnType<typeof analyzeGDPRCompliance>;\r\n"
    "    ccpa: ReturnType<typeof analyzeCCPACompliance>;\r\n"
    "    soc2: ReturnType<typeof analyzeSOC2Compliance>;\r\n"
    "    iso27001: ReturnType<typeof analyzeISO27001Compliance>;\r\n"
    "  };\r\n"
    "  reports: ComplianceReport[];\r\n"
    "}\r\n\r\n"
)
text = text.replace(insert_anchor, insert_anchor + new_types)

old_block = (
    "  // Generate comprehensive report\r\n"
    "  const report = {\r\n"
    "    reportInfo: {\r\n"
    "      type: reportType,\r\n"
    "      generatedAt: new Date().toISOString(),\r\n"
    "      scope: userId ? 'user_specific' : 'system_wide',\r\n"
    "      userId: userId || 'all_users',\r\n"
    "    },\r\n"
    "    complianceMetrics: analyzeComplianceMetrics(events, reportType),\r\n"
    "    auditEvents: events.slice(0, 1000), // Limit for performance\r\n"
    "    userData: userData?.slice(0, 100), // Limit for privacy\r\n"
    "    recommendations: [] as string[],\r\n"
    "    certifications: {\r\n"
    "      gdpr: analyzeGDPRCompliance(events),\r\n"
    "      ccpa: analyzeCCPACompliance(events),\r\n"
    "      soc2: analyzeSOC2Compliance(events),\r\n"
    "      iso27001: analyzeISO27001Compliance(events),\r\n"
    "    },\r\n"
    "  };\r\n\r\n"
    "  report.recommendations = generateRecommendations(\r\n"
    "    report.complianceMetrics,\r\n"
    "    'compliant',\r\n"
    "  );\r\n\r\n"
    "  return report;\r\n" \
    ")\r\n"
)
if old_block not in text:
    raise SystemExit('Old report block not found')
new_block = (
    "  // Generate comprehensive report\r\n"
    "  const report: DetailedComplianceReport = {\r\n"
    "    reportInfo: {\r\n"
    "      type: reportType,\r\n"
    "      generatedAt: new Date().toISOString(),\r\n"
    "      scope: userId ? 'user_specific' : 'system_wide',\r\n"
    "      userId: userId || 'all_users',\r\n"
    "    },\r\n"
    "    complianceMetrics: analyzeComplianceMetrics(events, reportType),\r\n"
    "    auditEvents: events.slice(0, 1000),\r\n"
    "    userData: userData?.slice(0, 100) ?? null,\r\n"
    "    recommendations: [],\r\n"
    "    certifications: {\r\n"
    "      gdpr: analyzeGDPRCompliance(events),\r\n"
    "      ccpa: analyzeCCPACompliance(events),\r\n"
    "      soc2: analyzeSOC2Compliance(events),\r\n"
    "      iso27001: analyzeISO27001Compliance(events),\r\n"
    "    },\r\n"
    "    reports: [],\r\n"
    "  };\r\n\r\n"
    "  const complianceLevel = determineComplianceLevel(report.complianceMetrics);\r\n\r\n"
    "  report.recommendations = generateRecommendations(\r\n"
    "    report.complianceMetrics,\r\n"
    "    complianceLevel,\r\n"
    "  );\r\n\r\n"
    "  const summaryReport: ComplianceReport = {\r\n"
    "    id: `summary_${reportType}_${Date.now()}`,\r\n"
    "    title: getReportTitle(reportType),\r\n"
    "    description: getReportDescription(reportType),\r\n"
    "    generatedAt: report.reportInfo.generatedAt,\r\n"
    "    reportType,\r\n"
    "    metrics: report.complianceMetrics,\r\n"
    "    recommendations: report.recommendations,\r\n"
    "    complianceLevel,\r\n"
    "  };\r\n\r\n"
    "  const certificationReports: ComplianceReport[] = Object.entries(\r\n"
    "    report.certifications,\r\n"
    "  ).map(([key, certification]) => {\r\n"
    "    const typed = certification as { complianceScore?: number };\r\n"
    "    const score = typed.complianceScore ?? 0;\r\n"
    "    const level: ComplianceReport['complianceLevel'] =\r\n"
    "      score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non-compliant';\r\n\r\n"
    "    return {\r\n"
    "      id: `${key}_${Date.now()}`,\r\n"
    "      title: getReportTitle(key),\r\n"
    "      description: getReportDescription(key),\r\n"
    "      generatedAt: report.reportInfo.generatedAt,\r\n"
    "      reportType: key,\r\n"
    "      metrics: {\r\n"
    "        complianceScore: score,\r\n"
    "        details: certification,\r\n"
    "      },\r\n"
    "      recommendations: report.recommendations,\r\n"
    "      complianceLevel: level,\r\n"
    "    };\r\n"
    "  });\r\n\r\n"
    "  report.reports = [summaryReport, ...certificationReports];\r\n\r\n"
    "  return report;\r\n" \
    ")\r\n"
)
text = text.replace(old_block, new_block)

replacements = {
    "dYs\" No audit events found - ensure audit logging is properly configured": 'ALERT: No audit events found - ensure audit logging is properly configured',
    "�s��,? Some events lack cryptographic hashes - verify audit event creation process": 'WARN: Some events lack cryptographic hashes - verify audit event creation process',
    "dY\"< No policy interaction events - ensure terms acceptance is being logged": 'NOTICE: No policy interaction events - ensure terms acceptance is being logged',
    "dY\"S No recent activity - monitor system usage and engagement": 'NOTICE: No recent activity - monitor system usage and engagement',
    "�o. System meets compliance requirements - maintain current practices": 'SUCCESS: System meets compliance requirements - maintain current practices',
    "�o. All compliance checks passed - excellent audit trail maintenance": 'SUCCESS: All compliance checks passed - excellent audit trail maintenance',
}
for old, new in replacements.items():
    if old in text:
        text = text.replace(old, new)

text = text.replace(
    "    case 'soc2':\r\n      return 'SOC 2 Compliance Report';",
    "    case 'soc2':\r\n      return 'SOC 2 Compliance Report';\r\n    case 'iso27001':\r\n      return 'ISO 27001 Compliance Report';"
)
text = text.replace(
    "    case 'soc2':\r\n      return 'Service Organization Control 2 audit trail analysis';",
    "    case 'soc2':\r\n      return 'Service Organization Control 2 audit trail analysis';\r\n    case 'iso27001':\r\n      return 'ISO 27001 information security management assessment';"
)

path.write_text(text, encoding='utf-8')
