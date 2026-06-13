import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../../store/uiSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-accent-green shrink-0" />,
  error: <XCircle className="w-4 h-4 text-primary shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
}

const ToastItem = ({ toast }) => {
  const dispatch = useDispatch()
  const dismiss = () => dispatch(removeToast(toast.id))

  useEffect(() => {
    const t = setTimeout(dismiss, 3500)
    return () => clearTimeout(t)
  }, [toast.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 glass-dark rounded-xl px-4 py-3 shadow-xl min-w-[240px] max-w-sm"
    >
      {ICONS[toast.type] || ICONS.info}
      <span className="text-sm text-text-primary flex-1">{toast.message}</span>
      <button onClick={dismiss} className="hover:text-white text-text-secondary transition-colors shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const toasts = useSelector(s => s.ui.toasts)

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </AnimatePresence>
    </div>
  )
}
