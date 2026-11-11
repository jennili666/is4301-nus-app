import { createContext, useCallback, useContext, useState } from "react";

const NotificationContext = createContext(() => {});

const ICONS = { success: "✓", error: "!", info: "i" };

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((list) => list.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (type, title, message) => {
      const id = `${Date.now()}-${Math.random()}`;
      setItems((list) => [...list.slice(-2), { id, type, title, message }]);
      setTimeout(() => dismiss(id), type === "error" ? 9000 : 6000);
    },
    [dismiss]
  );

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="notifications" aria-live="assertive">
        {items.map((item) => (
          <div
            key={item.id}
            className={`notification notification--${item.type}`}
            role={item.type === "error" ? "alert" : "status"}
          >
            <span className="notification__icon" aria-hidden="true">
              {ICONS[item.type]}
            </span>
            <div className="notification__body">
              <strong>{item.title}</strong>
              <p>{item.message}</p>
            </div>
            <button
              type="button"
              className="notification__close"
              aria-label="Dismiss notification"
              onClick={() => dismiss(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  return useContext(NotificationContext);
}
