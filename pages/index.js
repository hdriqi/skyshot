import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '../components/layout'

const HomePage = () => {
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [shots, setShots] = useState([])

  useEffect(() => {
    const localShots = window.localStorage.getItem('shots')
    if(localShots) {
      setShots(JSON.parse(localShots))
    }
  }, [])

  const _removeShot = async (idx) => {
    const conf = confirm('Are you sure you want to delete this shot?')
    if(conf) {
      const cloneShots = JSON.parse(JSON.stringify(shots))
      cloneShots.splice(idx, 1)
      window.localStorage.setItem('shots', JSON.stringify(cloneShots))
      setShots(cloneShots)
    }
  }

  const _submit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    const resp = await axios.post(`/render`, {
      url: url
    })
    if(resp.data.success) {
      const shotData = {
        url: `https://siasky.net/${resp.data.data.skylink}`,
        originalUrl: url,
        createdAt: new Date().getTime()
      }
      const shots = window.localStorage.getItem('shots')
      if(shots) {
        const currentData = JSON.parse(shots)
        currentData.push(shotData)
        window.localStorage.setItem('shots', JSON.stringify(currentData))
        setShots(currentData)
      }
      else {
        window.localStorage.setItem('shots', JSON.stringify([shotData]))
        setShots([shotData])
      }
    }
    setSubmitting(false)
    setUrl('')
  }

  return (
    <Layout>
      <div className="max-w-3xl m-auto">
        <div className="text-center p-4 mt-8">
          <p className="text-3xl font-bold" style={{
            color: `#57B560`
          }}>Skyshot</p>
          <p className="mt-2 text-lg text-gray-900">Capture and store web page screenshot on decentralized storage</p>
          <p className="text-lg text-gray-900">powered by Sia</p>
        </div>
        <form onSubmit={e => _submit(e)} className="px-4" >
          <div className="flex flex-wrap mt-8">
            <div className="w-full pr-0 md:pr-4 md:w-9/12">
              <input placeholder="https://example.com" className="w-full focus:outline-none p-2 bg-gray-100 border border-solid border-gray-300 rounded-sm" type="text" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <div className="w-full pt-4 md:pt-0 md:w-3/12">
              <button disabled={submitting} type="submit" className="w-full p-2 rounded-sm text-center" style={{
                backgroundColor: `#57B560`
              }}>
                <div className="flex items-center justify-center">
                  {
                    submitting ? (
                      <svg className="mr-2" width="18" height="18" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(34.4164 50 50)">
                          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1">
                          </animateTransform></circle>
                      </svg>
                    ) : (
                      <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.93702 5.84538C7.00787 5.74688 7.08656 5.62631 7.18689 5.46372C7.22355 5.40433 7.32349 5.23944 7.39792 5.11665L7.39798 5.11654L7.4818 4.97841C8.31079 3.62239 8.91339 3 10 3H14C15.0866 3 15.6892 3.62239 16.5182 4.97841L16.6021 5.11664C16.6765 5.23943 16.7765 5.40433 16.8131 5.46372C16.9134 5.62631 16.9921 5.74688 17.063 5.84538C17.1097 5.91033 17.1505 5.96194 17.1838 6H20C21.6569 6 23 7.34315 23 9V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V9C1 7.34315 2.34315 6 4 6H6.8162C6.84949 5.96194 6.8903 5.91033 6.93702 5.84538ZM4 8C3.44772 8 3 8.44772 3 9V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V9C21 8.44772 20.5523 8 20 8H17C16.3357 8 15.8876 7.63641 15.4394 7.01326C15.3363 6.86988 15.2341 6.71332 15.1111 6.51409C15.069 6.44583 14.9596 6.26536 14.8846 6.14152L14.8118 6.02159C14.3595 5.28172 14.0867 5 14 5H10C9.91327 5 9.6405 5.28172 9.1882 6.02159L9.11543 6.14152L9.11502 6.14219C9.03998 6.26601 8.93092 6.44596 8.88887 6.51409C8.76592 6.71332 8.66375 6.86988 8.56061 7.01326C8.11237 7.63641 7.66434 8 7 8H4ZM20 10C20 10.5523 19.5523 11 19 11C18.4477 11 18 10.5523 18 10C18 9.44772 18.4477 9 19 9C19.5523 9 20 9.44772 20 10ZM7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13C17 10.2386 14.7614 8 12 8C9.23858 8 7 10.2386 7 13ZM15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z" fill="white"/>
                      </svg>
                    )
                  }
                  <p className="font-semibold text-white">Screenshot</p>
                </div>
              </button>
            </div>
          </div>
        </form>
        <div className="mt-8">
          <div className="px-4">
            <p className="text-2xl font-bold text-gray-800">Shots</p>
          </div>
          <div className="mt-4 flex flex-wrap px-2">
            {
              shots.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((shot, idx) => {
                return (
                  <div key={idx} className="w-full md:w-1/2 p-2 rounded-sm relative">
                    <img src={shot.url} />
                    <div className="absolute inset-0 m-2 p-2 overflow-hidden flex flex-col" style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)`
                    }}>
                      <div className="ml-auto">
                        <div className="cursor-pointer" onClick={() => _removeShot(idx)}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z" fill="#ed4437"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex h-full items-end overflow-hidden">
                        <div>
                          <div className="flex items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM3.06565 10.9074C3.35719 11.2805 4.16782 11.758 5.40826 12.1475C5.89668 12.3009 6.4316 12.4357 7.00555 12.5502C7.00186 12.3679 7 12.1844 7 12C7 8.67236 7.60556 5.6673 8.65455 3.64231C5.66412 4.84042 3.46628 7.59699 3.06565 10.9074ZM7.12914 14.6108C5.52334 14.3317 4.14644 13.9093 3.10296 13.3658C3.58837 16.5542 5.74677 19.1927 8.65455 20.3577C7.88867 18.8792 7.35916 16.8783 7.12914 14.6108ZM9.17891 14.8773C10.076 14.9581 11.0209 15 12 15C12.9633 15 13.9124 14.9454 14.8253 14.8441C14.3742 18.4417 13.127 21 12 21C10.8765 21 9.63347 18.4574 9.17891 14.8773ZM14.9863 12.8045C14.0367 12.9275 13.028 13 12 13C10.9558 13 9.95341 12.9483 9.01531 12.8502C9.00522 12.5706 9 12.287 9 12C9 6.98399 10.5936 3 12 3C13.4064 3 15 6.98399 15 12C15 12.2713 14.9953 12.5397 14.9863 12.8045ZM16.8792 14.5269C16.6539 16.8289 16.1208 18.861 15.3454 20.3577C18.3046 19.1721 20.4876 16.4606 20.9212 13.1964C19.861 13.7479 18.4647 14.209 16.8792 14.5269ZM20.9285 10.8601C20.458 11.3883 18.9737 12.0157 16.9962 12.4541C16.9987 12.3035 17 12.1521 17 12C17 8.67236 16.3944 5.6673 15.3454 3.64231C18.3216 4.83471 20.5128 7.57077 20.9285 10.8601Z" fill="white"/>
                            </svg>
                            <a className="pl-2 text-sm text-white truncate" href={shot.originalUrl} target="_blank">
                              {shot.originalUrl}
                            </a>
                          </div>
                          <div className="mt-1 flex items-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M6.93702 5.84538C7.00787 5.74688 7.08656 5.62631 7.18689 5.46372C7.22355 5.40433 7.32349 5.23944 7.39792 5.11665L7.39798 5.11654L7.4818 4.97841C8.31079 3.62239 8.91339 3 10 3H14C15.0866 3 15.6892 3.62239 16.5182 4.97841L16.6021 5.11664C16.6765 5.23943 16.7765 5.40433 16.8131 5.46372C16.9134 5.62631 16.9921 5.74688 17.063 5.84538C17.1097 5.91033 17.1505 5.96194 17.1838 6H20C21.6569 6 23 7.34315 23 9V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V9C1 7.34315 2.34315 6 4 6H6.8162C6.84949 5.96194 6.8903 5.91033 6.93702 5.84538ZM4 8C3.44772 8 3 8.44772 3 9V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V9C21 8.44772 20.5523 8 20 8H17C16.3357 8 15.8876 7.63641 15.4394 7.01326C15.3363 6.86988 15.2341 6.71332 15.1111 6.51409C15.069 6.44583 14.9596 6.26536 14.8846 6.14152L14.8118 6.02159C14.3595 5.28172 14.0867 5 14 5H10C9.91327 5 9.6405 5.28172 9.1882 6.02159L9.11543 6.14152L9.11502 6.14219C9.03998 6.26601 8.93092 6.44596 8.88887 6.51409C8.76592 6.71332 8.66375 6.86988 8.56061 7.01326C8.11237 7.63641 7.66434 8 7 8H4ZM20 10C20 10.5523 19.5523 11 19 11C18.4477 11 18 10.5523 18 10C18 9.44772 18.4477 9 19 9C19.5523 9 20 9.44772 20 10ZM7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13C17 10.2386 14.7614 8 12 8C9.23858 8 7 10.2386 7 13ZM15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z" fill="white"/>
                            </svg>
                            <a className="pl-2 text-sm text-white truncate" href={shot.url} target="_blank">
                              {shot.url}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage