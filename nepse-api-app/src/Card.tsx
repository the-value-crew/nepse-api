
type Props = {
  children: any,
  className: string
}

const Card = ({ children, className }: Props) => {
  return (
    <div className={`${className} bg-white rounded shadow m-4 p-4`}>
      {children}
    </div>
  )
}

export default Card
