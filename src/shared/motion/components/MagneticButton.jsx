import { Button } from '@/shared/ui'
import { useMagnetic } from '../hooks/useMagnetic'

/** Button dengan tarikan magnetik ke kursor. Props sama dengan <Button>. */
export default function MagneticButton({ radius, strength, ...props }) {
  const ref = useMagnetic({ radius, strength })
  return <Button ref={ref} {...props} />
}
