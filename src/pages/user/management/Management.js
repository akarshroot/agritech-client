import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import FloatingMenu from '../../../layout/FloatingMenu'
import { renderWidget } from '../../../assets/widgets/Widgets'
import './Management.css'
import Spinner from 'react-bootstrap/esm/Spinner'
import Helmet from 'react-helmet'

function Management(props) {
  const [loading, setLoading] = useState(true)
  const { theme } = useUser()
  const widgets=[
    {
      category: "inventory",
      id: "current-inventory"
    },
    {
      title: "Crops Sown",
      id: "current-pipeline"
    },
    {
      title: "Current Plan",
      id: "current-plan"
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200);
  }, [])

  return (
    <>
    <Helmet>
      <title>Management | AgriTech</title>
    </Helmet>
      <div className={`theme-${theme} management-widgets w-100`}>
        <div className="row m-0">
          <div className='col-md-6 col-lg-8 col-xl-6 p-3'>
            <div className="widget">
              {
                renderWidget('msp')
              }
            </div>
          </div>
          {
            widgets.map((widget) => {
              return (
                <div key={widget.id} className='col-md-6 col-lg-4 col-xl-3 p-3'>
                  <div className={`widget ${loading ? "skeleton-widget" : ""}`}>
                    {
                      loading ? <></> :
                        <>
                          {renderWidget(widget.id, widget.data)}
                        </>
                    }
                  </div>
                </ div>
              )
            })
          }
        </div>
        <FloatingMenu theme={theme} />
      </div>
    </>
  )
}

export default Management