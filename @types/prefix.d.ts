declare module 'prefix' {
  function prefixStyle(key: string): string;
  namespace prefixStyle {
    function dash(key: string): string;
  }

  export = prefixStyle;
}
