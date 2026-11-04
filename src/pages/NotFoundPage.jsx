import { Link } from 'react-router-dom'
import { Button, Icon, SectionHeading } from '@/components/ui'
import { ROUTES } from '@/constants'

export function NotFoundPage() {
  return (
    <div className="page">
      <SectionHeading
        as="h1"
        eyebrow="Error 404"
        title="Página"
        highlight="no encontrada"
        description="La página que buscas no existe o fue movida."
      />
      <div>
        <Button as={Link} to={ROUTES.HOME} icon={<Icon name="arrow" />}>VOLVER AL INICIO</Button>
      </div>
    </div>
  )
}
