/** Keyboard-first bypass for repeated global navigation and visual shell controls. */
export function SkipToContent() {
  const moveToMain = () => {
    const main = document.querySelector<HTMLElement>('main#main-content')
      ?? document.querySelector<HTMLElement>('main');
    if (!main) return;
    // A non-tabbable focus target keeps the normal Tab order intact.
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
    main.scrollIntoView?.({ block: 'start', behavior: 'auto' });
  };

  return <button type="button" className="scamsignal-skip-link" onClick={moveToMain}>
    Skip to main content
  </button>;
}
