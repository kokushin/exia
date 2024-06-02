const items = [
  { label: "SAVE", action: undefined },
  { label: "LOAD", action: undefined },
  { label: "AUTO", action: undefined },
  { label: "SKIP", action: undefined },
  { label: "LOG", action: undefined },
  { label: "CONFIG", action: undefined },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 right-0 z-20 flex items-center gap-4 text-white text-sm p-4">
      {items.map((item, i) => (
        <button
          onClick={item.action}
          key={i}
          style={{
            textShadow: "1px 1px 0 rgba(0,0,0,.5)",
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};
