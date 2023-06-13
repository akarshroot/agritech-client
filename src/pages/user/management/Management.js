import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import FloatingMenu from '../../../layout/FloatingMenu'
import { renderWidget } from '../../../assets/widgets/Widgets'
import './Management.css'
import Spinner from 'react-bootstrap/esm/Spinner'

function Management(props) {
  const [loading, setLoading] = useState(true)
  const { theme } = useUser()
  const [widgets, setWidgets] = useState([
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
    },
    {
      title: "MSP",
      id: "msp"
    }
  ])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200);
  }, [])

  return (
    <div className={`p-3 theme-${theme} management-widgets w-100`}>
      <div className="row">
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
  )
}

export default Management