declare module 'stats.js' {
  export default class Stats {
    constructor();

    REVISION: number;
    dom: HTMLElement;
    addPanel(panel: Stats.Panel): Stats.Panel;
    showPanel(id: number): void;
    begin(): void;
    end(): number;
    update(): void;
    domElement: HTMLElement;
    setMode(id: number): void;

    static Panel: {
      new (name: string, fg: string, bg: string): Stats.Panel;
    };
  }

  namespace Stats {
    interface Panel {
      dom: HTMLCanvasElement;
      update(value: number, maxValue: number): void;
    }
  }
}
