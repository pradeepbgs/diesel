type Handler = (ctx?: any) => any;

const METHODS = [
  "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"
] as const;

type Method = typeof METHODS[number];

const METHOD_INDEX: Record<string, number> = Object.create(null);
for (let i = 0; i < METHODS.length; i++) METHOD_INDEX[METHODS[i]] = i;

class Node {
  staticChildren: Record<string, Node> | null = null;
  paramChild: Node | null = null;
  paramName: string | null = null;

  // array is faster than object for fixed small set
  handlers: (Handler | null)[] = new Array(METHODS.length).fill(null);
}

export class FastRouter {
  private root = new Node();

  add(method: Method, path: string, handler: Handler) {
    const m = METHOD_INDEX[method];
    if (m === undefined) throw new Error(`Unsupported method ${method}`);

    let node = this.root;
    let i = 1;
    let start = 1;

    for (; i <= path.length; i++) {
      if (i === path.length || path.charCodeAt(i) === 47) {
        const segment = path.slice(start, i);

        if (segment[0] === ":") {
          if (!node.paramChild) {
            node.paramChild = new Node();
            node.paramChild.paramName = segment.slice(1);
          }
          node = node.paramChild;
        } else {
          if (!node.staticChildren) node.staticChildren = Object.create(null);
          node = node.staticChildren[segment] ??= new Node();
        }

        start = i + 1;
      }
    }

    node.handlers[m] = handler;
  }

  find(method: Method, path: string) {
    let node = this.root;
    let i = 1;
    let start = 1;

    let params: Record<string, string> | null = null;

    for (; i <= path.length; i++) {
      if (i === path.length || path.charCodeAt(i) === 47) {
        const segment = path.slice(start, i);

        const staticNext = node.staticChildren?.[segment];
        if (staticNext) {
          node = staticNext;
        } else if (node.paramChild) {
          if (!params) params = Object.create(null);
          params[node.paramChild.paramName!] = segment;
          node = node.paramChild;
        } else {
          return null;
        }

        start = i + 1;
      }
    }

    const handler = node.handlers[method as any];
    if (!handler) return null;

    return {
      handler,
      params,
    };
  }
}
