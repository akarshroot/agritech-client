import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useUser } from './UserContext'

const ManagementContext = React.createContext()

export function ManagementContextProvider({ children }) {

    const { currentUser } = useUser()

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
    


    const values = {
        createPlan,
        getUserPlans,
        deleteUserPlan,
        executeUserPlan
    }
    return (
        <ManagementContext.Provider value={values}>
            {children}
        </ManagementContext.Provider>
    )
}

export default ManagementContext