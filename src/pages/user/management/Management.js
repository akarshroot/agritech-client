import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import FloatingMenu from '../../../layout/FloatingMenu'
import { renderWidget } from '../../../assets/widgets/Widgets'
import './Management.css'

function Management(props) {
  const [loading, setLoading] = useState(true)
  const { theme } = useUser()
  const widgets=[
    {
      title: "MSP",
      id: "msp"
    },
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
  ]

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200);
  }, [])

  return (
    <div className={`theme-${theme} management-widgets-container`}>
      <h2 className='display-4 m-0 p-3 pt-0'>
        AgriManage
      </h2>
      <div className={`management-widgets w-100`}>
          {
            widgets.map((widget) => {
              return (
                  <React.Fragment key={widget.id}>
                    {
                      loading ? <></> :
                      <>
                        {renderWidget(widget.id, widget.data)}
                      </>
                    }
                  </React.Fragment>
              )
            })
          }
          {/* <div> */}
            <FloatingMenu theme={theme} />
          {/* </div> */}
      </div>
    </div>
  )
}

export default Management