import { Suspense } from 'react'
import { FlightListing } from './FlightListing'

const page = async() => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <FlightListing/>
    </Suspense>
  )
}

export default page