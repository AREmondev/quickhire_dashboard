import { Text } from '@/components/ui/Text'
import { IMAGES } from '@/lib/constants'
import Image from 'next/image'
import React from 'react'

const Companies = () => {
  return (
      <section className="w-ull py-12">
          <div className="container">
              <div className="flex flex-col gap-8">
                  <Text variant="body_lg" className='text-black/50'>
                      Companies we helped grow
                  </Text>
                  <div className="flex w-full items-cneter  justify-between flex-wrap gap-10 items-center">
                      {
                          IMAGES.CCOMPANY_IMAGES.map((item) => (
                              <Image key={item.name} width={200} height={30} src={item.image} alt={item.name} className=" w-auto " />
                          ))
                      }
                  </div>
              </div>
          </div>
    </section>
  )
}

export default Companies