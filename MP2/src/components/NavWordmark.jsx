export default function NavWordmark({ onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate('setup')}
      className="text-left text-xl font-bold text-[#4285F4] transition-opacity hover:opacity-80"
    >
      ✦ ResearchFlow
    </button>
  )
}
