export default function NavBar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 overflow-x-auto whitespace-nowrap">
        <ul className="flex flex-wrap lg:flex-nowrap items-center justify-between">
          <li className="min-w-0">
            <a className="min-w-0 px-3 py-2" href="/pricing">
              Pricing
            </a>
          </li>
          {/* more <li>…</li> */}
        </ul>
      </div>
    </nav>
  );
}
