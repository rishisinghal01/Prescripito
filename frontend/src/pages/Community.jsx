import React, { useEffect, useState, useContext } from 'react'
import Loading from './Loading'
import { ChatContext } from '../context/Chatcontext'
import { toast } from 'react-toastify'

const Community = () => {
  const [images, setimages] = useState([])
  const [loading, setloading] = useState(true)
  const { axios ,token} = useContext(ChatContext)

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/api/user/published-image',{headers:{token:token}})

      if (data.success) {
        setimages(data.images)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='p-6 pt-12 w-full mx-auto h-full overflow-y-scroll'>
      <h2 className='text-xl font-semibold mb-6 text-gray-800'>Community Images</h2>

      {images.length > 0 ? (
        <div className='flex flex-wrap max-sm:justify-center gap-5'>
          {images.map((item, idx) => (
            <a
              href={item.imageUrl}
              key={idx}
              target='_blank'
              className='relative group block rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              <img
                className='w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
                src={item.imageUrl}
                alt=""
              />
              <p className='absolute right-0 bottom-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>
                Created by: {item.username}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 mt-10'>No Images Available</p>
      )}
    </div>
  )
}

export default Community
