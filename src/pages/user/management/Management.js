import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import FloatingMenu from '../../../layout/FloatingMenu'
import { renderWidget } from '../../../assets/widgets/Widgets'
import './Management.css'

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
      title: "Transaction History",
      id: "transaction-history"
    },
    {
      title: "Order Details",
      id: "current-order"
    },
    {
      title: "Order History",
      id: "order-history"
    }
  ])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2234);
  }, [])

  return (
    <div className={`management-container theme-${theme}`}>
      <div className="widgets-section management-widgets">
        {
          widgets.map((widget) => {
            return (
              <>
                <div className={`widget ${loading ? "skeleton-widget" : "no-skeleton-widget"}`}>
                  {
                    loading ? <></> :
                      <>
                        {renderWidget(widget.id, widget.data)}
                      </>
                  }
                </div>
              </>
            )
          })
        }
      </div>
      <FloatingMenu theme={theme} />
    </div>
  )
}

export default Management