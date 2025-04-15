/**
 * DOM 조작 관련 유틸리티 함수
 */

/**
 * 주어진 ID로 요소를 가져옵니다.
 */
export const getElementById = (id: string): HTMLElement | null => {
  return document.getElementById(id);
};

/**
 * 주어진 선택자로 단일 요소를 가져옵니다.
 */
export const querySelector = <T extends Element = Element>(selector: string): T | null => {
  return document.querySelector<T>(selector);
};

/**
 * 주어진 선택자로 모든 요소를 가져옵니다.
 */
export const querySelectorAll = <T extends Element = Element>(selector: string): T[] => {
  return Array.from(document.querySelectorAll<T>(selector));
};

/**
 * 요소의 자식 요소들을 모두 제거합니다.
 */
export const removeAllChildren = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/**
 * 새로운 요소를 생성합니다.
 */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions
): HTMLElementTagNameMap[K] => {
  return document.createElement(tagName, options);
};

/**
 * 요소에 클래스를 추가합니다.
 */
export const addClass = (element: Element, ...classNames: string[]): void => {
  element.classList.add(...classNames);
};

/**
 * 요소에서 클래스를 제거합니다.
 */
export const removeClass = (element: Element, ...classNames: string[]): void => {
  element.classList.remove(...classNames);
};

/**
 * 요소가 특정 클래스를 가지고 있는지 확인합니다.
 */
export const hasClass = (element: Element, className: string): boolean => {
  return element.classList.contains(className);
};

/**
 * 요소의 클래스를 토글합니다.
 */
export const toggleClass = (element: Element, className: string, force?: boolean): void => {
  element.classList.toggle(className, force);
};

/**
 * 요소에 스타일을 적용합니다.
 */
export const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
  Object.assign(element.style, styles);
};

/**
 * 요소에 속성을 설정합니다.
 */
export const setAttribute = (element: Element, name: string, value: string): void => {
  element.setAttribute(name, value);
};

/**
 * 요소에서 속성을 가져옵니다.
 */
export const getAttribute = (element: Element, name: string): string | null => {
  return element.getAttribute(name);
};

/**
 * 요소에서 속성을 제거합니다.
 */
export const removeAttribute = (element: Element, name: string): void => {
  element.removeAttribute(name);
};

/**
 * 요소에서 데이터 속성을 가져옵니다.
 */
export const getDataAttribute = (element: HTMLElement, name: string): string | undefined => {
  return element.dataset[name];
};

/**
 * 요소에 데이터 속성을 설정합니다.
 */
export const setDataAttribute = (element: HTMLElement, name: string, value: string): void => {
  element.dataset[name] = value;
};

/**
 * 자식 요소를 부모 요소에 추가합니다.
 */
export const appendChild = <T extends Node>(parent: Node, child: T): T => {
  return parent.appendChild(child);
};

/**
 * 요소의 텍스트 내용을 설정합니다.
 */
export const setTextContent = (element: Node, text: string): void => {
  element.textContent = text;
};

/**
 * 요소의 HTML 내용을 설정합니다.
 * 주의: 이 함수는 XSS 공격에 취약할 수 있습니다. 사용자 입력을 직접 전달하지 마세요.
 */
export const setInnerHTML = (element: Element, html: string): void => {
  element.innerHTML = html;
};

/**
 * 요소를 DOM에서 제거합니다.
 */
export const removeElement = (element: Element): void => {
  element.parentNode?.removeChild(element);
};

/**
 * 요소가 특정 선택자와 일치하는지 확인합니다.
 */
export const matches = (element: Element, selector: string): boolean => {
  return element.matches(selector);
};

/**
 * 요소의 부모 요소를 가져옵니다.
 */
export const getParentElement = (element: Element): Element | null => {
  return element.parentElement;
};

/**
 * 선택자와 일치하는 가장 가까운 상위 요소를 찾습니다.
 */
export const closest = <T extends Element = Element>(
  element: Element,
  selector: string
): T | null => {
  return element.closest<T>(selector);
};

/**
 * 요소의 위치 정보를 가져옵니다.
 */
export const getBoundingClientRect = (element: Element): DOMRect => {
  return element.getBoundingClientRect();
};

/**
 * 요소가 뷰포트에 보이는지 확인합니다.
 */
export const isElementVisible = (element: Element): boolean => {
  const rect = getBoundingClientRect(element);
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * 요소가 부분적으로 뷰포트에 보이는지 확인합니다.
 */
export const isElementPartiallyVisible = (element: Element): boolean => {
  const rect = getBoundingClientRect(element);
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.bottom > 0 &&
    rect.right > 0
  );
};

/**
 * 요소에 이벤트 리스너를 추가합니다.
 */
export const addEventListenerToElement = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  eventType: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void => {
  element.addEventListener(eventType, listener, options);
};

/**
 * 요소에서 이벤트 리스너를 제거합니다.
 */
export const removeEventListenerFromElement = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  eventType: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | EventListenerOptions
): void => {
  element.removeEventListener(eventType, listener, options);
};

/**
 * 요소를 복제합니다.
 */
export const cloneElement = <T extends Node>(node: T, deep: boolean = true): T => {
  return node.cloneNode(deep) as T;
};

/**
 * 문서의 현재 활성화된 요소를 가져옵니다.
 */
export const getActiveElement = (): Element | null => {
  return document.activeElement;
};

/**
 * 요소에 포커스를 설정합니다.
 */
export const focusElement = (element: HTMLElement): void => {
  element.focus();
};

/**
 * 요소에서 포커스를 해제합니다.
 */
export const blurElement = (element: HTMLElement): void => {
  element.blur();
};

/**
 * 스크롤 위치를 가져옵니다.
 */
export const getScrollPosition = (): { x: number; y: number } => {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
};

/**
 * 지정된 위치로 스크롤합니다.
 */
export const scrollTo = (x: number, y: number, options?: ScrollToOptions): void => {
  window.scrollTo({ left: x, top: y, behavior: options?.behavior || 'auto' });
};

/**
 * 요소가 화면에 표시되도록 스크롤합니다.
 */
export const scrollElementIntoView = (
  element: Element,
  options?: ScrollIntoViewOptions
): void => {
  element.scrollIntoView(options || { behavior: 'smooth', block: 'start' });
};

/**
 * 요소의 오프셋 위치를 가져옵니다.
 */
export const getOffset = (element: HTMLElement): { top: number; left: number } => {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
};

/**
 * 특정 선택자를 가진 특정 요소의 자식 요소를 찾습니다.
 */
export const findChildBySelector = <T extends Element = Element>(
  parent: Element,
  selector: string
): T | null => {
  return parent.querySelector<T>(selector);
};

/**
 * 특정 선택자를 가진 모든 자식 요소를 찾습니다.
 */
export const findChildrenBySelector = <T extends Element = Element>(
  parent: Element,
  selector: string
): T[] => {
  return Array.from(parent.querySelectorAll<T>(selector));
};

/**
 * 형제 요소들을 가져옵니다.
 */
export const getSiblings = (element: Element): Element[] => {
  if (!element.parentNode) return [];
  
  return Array.from(element.parentNode.children).filter(child => child !== element);
};

/**
 * 다음 형제 요소를 가져옵니다.
 */
export const getNextSibling = (element: Element): Element | null => {
  return element.nextElementSibling;
};

/**
 * 이전 형제 요소를 가져옵니다.
 */
export const getPreviousSibling = (element: Element): Element | null => {
  return element.previousElementSibling;
};

/**
 * 주어진 클래스 이름을 가진 가장 가까운 상위 요소를 찾습니다.
 */
export const getClosestElementByClassName = (
  element: Element,
  className: string
): Element | null => {
  return element.closest(`.${className}`);
};

/**
 * 폼 요소의 값을 가져옵니다.
 */
export const getFormElementValue = (element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string => {
  return element.value;
};

/**
 * 폼 요소의 값을 설정합니다.
 */
export const setFormElementValue = (
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  value: string
): void => {
  element.value = value;
};

/**
 * 체크박스 또는 라디오 버튼 요소가 체크되었는지 확인합니다.
 */
export const isChecked = (element: HTMLInputElement): boolean => {
  return element.checked;
};

/**
 * 체크박스 또는 라디오 버튼 요소의 체크 상태를 설정합니다.
 */
export const setChecked = (element: HTMLInputElement, checked: boolean): void => {
  element.checked = checked;
};

/**
 * 요소의 너비를 가져옵니다.
 */
export const getElementWidth = (element: HTMLElement): number => {
  return element.offsetWidth;
};

/**
 * 요소의 높이를 가져옵니다.
 */
export const getElementHeight = (element: HTMLElement): number => {
  return element.offsetHeight;
};

/**
 * 요소를 토글합니다. (보이기/숨기기)
 */
export const toggleElementVisibility = (element: HTMLElement): void => {
  if (element.style.display === 'none') {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
};