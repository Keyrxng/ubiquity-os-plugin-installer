import { ManifestProps } from "../types/plugins";
export const manifestGuiBody = document.getElementById("manifest-gui-body");

export function createElement<TK extends keyof HTMLElementTagNameMap>(tagName: TK, attributes: { [key: string]: string }): HTMLElementTagNameMap[TK] {
  const element = document.createElement(tagName);
  Object.keys(attributes).forEach((key) => {
    if (key === "textContent") {
      element.textContent = attributes[key];
    } else if (key in element) {
      (element as Record<string, string>)[key] = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  return element;
}
export function createInputRow(
  key: string,
  prop: ManifestProps,
  configDefaults: Record<string, { type: string; value: unknown; items: { type: string } | null }>
): void {
  const row = document.createElement("tr");

  const headerCell = document.createElement("td");
  headerCell.className = "table-data-header";
  headerCell.textContent = key;
  row.appendChild(headerCell);

  const valueCell = document.createElement("td");
  valueCell.className = "table-data-value";

  const input = createInput(key, prop.default, prop);
  valueCell.appendChild(input);

  row.appendChild(valueCell);
  manifestGuiBody?.appendChild(row);

  configDefaults[key] = {
    type: prop.type,
    value: prop.default,
    items: prop.items ? { type: prop.items.type } : null,
  };
}
export function createInput(key: string, defaultValue: unknown, prop: ManifestProps): HTMLElement {
  if (!key) {
    throw new Error("Input name is required");
  }

  let ele: HTMLElement;

  const dataType = prop.type;

  if (dataType === "object" || dataType === "array") {
    ele = createTextareaInput(key, defaultValue, dataType);
  } else if (dataType === "boolean") {
    ele = createBooleanInput(key, defaultValue);
  } else {
    ele = createStringInput(key, defaultValue, dataType);
  }

  return ele;
}
export function createStringInput(key: string, defaultValue: string | unknown, dataType: string): HTMLElement {
  const inputElem = createElement("input", {
    type: "text",
    id: key,
    name: key,
    "data-config-key": key,
    "data-type": dataType,
    class: "config-input",
    value: `${defaultValue}`,
  });
  return inputElem;
}
export function createBooleanInput(key: string, defaultValue: boolean | unknown): HTMLElement {
  const inputElem = createElement("input", {
    type: "checkbox",
    id: key,
    name: key,
    "data-config-key": key,
    "data-type": "boolean",
    class: "config-input",
  });

  if (defaultValue) {
    inputElem.setAttribute("checked", "");
  }

  return inputElem;
}
export function createTextareaInput(key: string, defaultValue: object | unknown, dataType: string): HTMLElement {
  const inputElem = createElement("textarea", {
    id: key,
    name: key,
    "data-config-key": key,
    "data-type": dataType,
    class: "config-input",
    rows: "5",
    cols: "50",
  });
  inputElem.textContent = JSON.stringify(defaultValue, null, 2);

  inputElem.setAttribute("placeholder", `Enter ${dataType} in JSON format`);

  return inputElem;
}