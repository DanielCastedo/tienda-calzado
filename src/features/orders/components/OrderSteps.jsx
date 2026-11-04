export function OrderSteps({ steps }) {
  return (
    <ol className="order-steps">
      {steps.map((step, i) => (
        <li key={step.titulo} className="order-steps__item">
          <span className="order-steps__number">{i + 1}</span>
          <div>
            <h3 className="order-steps__title">{step.titulo}</h3>
            <p className="order-steps__text">{step.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
