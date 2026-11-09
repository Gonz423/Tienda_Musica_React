function LayoutApp({ navbar, children, footer, modales }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {navbar}
      <main className="flex-grow-1">{children}</main>
      {modales}
      {footer}
    </div>
  )
}

export default LayoutApp
