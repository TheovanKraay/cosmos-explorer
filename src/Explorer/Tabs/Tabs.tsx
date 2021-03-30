import ko from "knockout";
import React, { useEffect, useRef } from "react";
import { useObservableState } from "../../hooks/useObservableState";
import TabsBase from "./TabsBase";

export function Tabs(props: { tabs: readonly TabsBase[] }): JSX.Element {
  const { tabs } = props;

  return (
    <div className="tabsManagerContainer">
      <div id="content" className="flexContainer hideOverflows">
        <div className="nav-tabs-margin">
          <ul className="nav nav-tabs level navTabHeight" id="navTabs" role="tablist">
            {tabs.map((tab) => (
              <Tab key={tab.tabId} tab={tab} />
            ))}
          </ul>
        </div>

        <div className="tabPanesContainer">
          {tabs.map((tab) => (
            <TabPane key={tab.tabId} tab={tab} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TabPane(props: { tab: TabsBase }) {
  const { tab } = props;
  const ref = useRef();
  const [isActive] = useObservableState(tab.isActive);
  const template = (tab.constructor as typeof TabsBase).component.template;

  useEffect(() => ko.applyBindingsToDescendants(tab, ref.current), [ref]);

  return (
    <div
      className="tabs-container"
      // eslint-disable-next-line no-null/no-null
      style={{ display: isActive ? null : "none" }}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: template }}
    ></div>
  );
}

function ErrorIcon(props: { tab: TabsBase }) {
  const { tab } = props;
  const className = "errorIconContainer";
  const [isActive] = useObservableState(tab.isActive);

  return (
    <div
      id="errorStatusIcon"
      role="button"
      title="Click to view more details"
      className={isActive ? `actionsEnabled ${className}` : className}
      tabIndex={isActive ? 0 : undefined}
      onClick={({ nativeEvent: e }) => tab.onErrorDetailsClick(undefined, e)}
      onKeyPress={({ nativeEvent: e }) => tab.onErrorDetailsKeyPress(undefined, e)}
    >
      <span className="errorIcon"></span>
    </div>
  );
}

function Tab(props: { tab: TabsBase }) {
  const { tab } = props;
  const className = "tabList";

  const [tabPath] = useObservableState(tab.tabPath);
  const [tabTitle] = useObservableState(tab.tabTitle);
  const [isExecuting] = useObservableState(tab.isExecuting);
  const [isExecutionError] = useObservableState(tab.isExecutionError);
  const [isActive] = useObservableState(tab.isActive);

  return (
    <li
      onClick={() => tab.onTabClick()}
      onKeyPress={({ nativeEvent: e }) => tab.onKeyPressActivate(undefined, e)}
      className={isActive ? `active ${className}` : className}
      key={tab.tabId}
      title={tabPath}
      aria-selected={isActive}
      aria-expanded={isActive}
      aria-controls={tab.tabId}
      tabIndex={0}
      role="tab"
    >
      <span className="tabNavContentContainer">
        <a data-toggle="tab" href={"#" + tab.tabId} tabIndex={-1}>
          <div className="tab_Content">
            <span className="statusIconContainer">
              {isExecutionError && <ErrorIcon tab={tab} />}
              {isExecuting && (
                <img
                  className="loadingIcon"
                  title="Loading"
                  src="../../../images/circular_loader_black_16x16.gif"
                  alt="Loading"
                />
              )}
            </span>
            <span className="tabNavText">{tabTitle}</span>
            <span className="tabIconSection">
              {isActive && (
                <span
                  title="Close"
                  role="button"
                  aria-label="Close Tab"
                  className="cancelButton"
                  onClick={() => tab.onCloseTabButtonClick()}
                  tabIndex={isActive ? 0 : undefined}
                  onKeyPress={({ nativeEvent: e }) => tab.onKeyPressClose(undefined, e)}
                >
                  <span className="tabIcon close-Icon">
                    <img src="../../../images/close-black.svg" title="Close" alt="Close" />
                  </span>
                </span>
              )}
            </span>
          </div>
        </a>
      </span>
    </li>
  );
}
