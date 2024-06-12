import React from 'react'

const Container = ({children}: {children: React.ReactNode}) => {
  return (
    <section className='max-w-[1920px] w-full mx-auto xl:px-20 px-4 py-3'>
        {children}
    </section>
  )
}

export default Container