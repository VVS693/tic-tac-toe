type HeaderProps = {
  onClick: () => void;
};

export function Header({ onClick }: HeaderProps) {
  return (
    <button
      className="w-full sticky top-6 text-center pt-4 pb-4 rounded-xl text-3xl font-bold text-blue-900 bg-gradient-to-r from-orange-400 to-pink-500 select-none"
      onClick={onClick}
    >
      TIC-TAC-TOE
    </button>
  );
}
