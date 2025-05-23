import User from "../models/user.model.js";
import { ADMIN_ID } from '../config/env.js'
import { signUp } from "./auth.controller.js";

export const getUsers = async (req, res, next) => {
    try {
        
        const users = await User.find()

        res.status(200).json({
            success: true,
            data: users
        })

    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.params.id).select('-password')

        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    try {

        if(req.user.id !== ADMIN_ID) {
            const error = new Error('Access denied: admin only')
            error.status = 403
            throw error
        }

        signUp()

    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {

        if (req.user.id !== req.params.id && req.user.id !== ADMIN_ID) {
            const error = new Error('Access denied: not authorized')
            error.status = 403
            throw error
        }

        const user = await User.findById(req.params.id)
            if (!user) {
            const error = new Error('User not found')
            error.status = 404
            throw error
        }

        const allowedUpdates = ['name', 'email', 'password']
        const updates = Object.keys(req.body)
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))


        if (!isValidOperation) {
            const error = new Error('Invalid updates')
            error.status = 400
            throw error
        }

        updates.forEach(field => {
            user[field] = req.body[field]
        })

        await user.save()

        res.status(200).json({ success: true, data: user })

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id)

        if (req.user.id !== req.params.id && req.user.id !== ADMIN_ID) {
            const error = new Error('Access denied: not authorized')
            error.status = 403
            throw error
        }

        if (!user) {
            const error = new Error('User not found')
            error.status = 404
            throw error
        }


        await user.deleteOne()
        
        res.status(200).json({ success: true, data: `user ${req.params.id} deleted` })
        
    } catch (error) {
        next(error)
    }
}