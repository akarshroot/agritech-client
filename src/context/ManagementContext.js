import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUser } from './UserContext'

const ManagementContext = React.createContext()

export function ManagementContextProvider({ children }) {

    const { currentUser } = useUser()

    const [inventory, setInventory] = useState()
    const [inventoryTotal, setInventoryTotal] = useState(0)

    const INR = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      });

    async function createPlan(planData) {
        try {
            planData.createdBy = currentUser
            const response = await axios.post("/management/plan/create", planData)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function getUserPlans() {
        try {
            const response = await axios.get("/management/plan/all?user=" + currentUser)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function deleteUserPlan(planId) {
        try {
            const response = await axios.delete("/management/plan?id=" + planId)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function executeUserPlan(planId) {
        try {
            const payload = {
                planId: planId,
                user: currentUser
            }
            const response = await axios.post("/management/plan/execute", payload)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function addItemToInventory(itemData) {
        try {
            itemData.ownerId = currentUser
            const response = await axios.post("/management/inventory/add", itemData)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function getUserInventory() {
        try {
            const response = await axios.get("/management/inventory/all?user=" + currentUser)
            if (response.hasOwnProperty("data")) {
                setInventory(response.data.data)
                setInventoryTotal(response.data.totalValue)
                return response.data
            }
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function deleteInventoryItem(itemid) {
        try {
            const response = await axios.delete("/management/inventory?itemId=" + itemid)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }

    async function updateQuantity(payload) {
        try {
            const response = await axios.post("/management/inventory/use", payload)
            if (response.hasOwnProperty("data"))
                return response.data
            else throw response.response.data
        } catch (error) {
            return error
        }
    }


    const values = {
        createPlan,
        getUserPlans,
        deleteUserPlan,
        executeUserPlan,
        addItemToInventory,
        getUserInventory,
        deleteInventoryItem,
        updateQuantity,
        inventory,
        inventoryTotal,
        INR
    }
    return (
        <ManagementContext.Provider value={values}>
            {children}
        </ManagementContext.Provider>
    )
}

export default ManagementContext