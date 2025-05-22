import Subscription from '../models/subscription.model.js'
import { ADMIN_ID } from '../config/env.js'

export const getAllSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== ADMIN_ID) {
            const error = new Error('Access denied: admin only')
            error.status = 403
            throw error
        }

        const subscriptions = await Subscription.find()
        res.status(200).json({ success: true, data: subscriptions })
        
    } catch (error) {
        next(error)
    }
}

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })

        res.status(201).json({ success: true, data: subscription})
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account')
            error.status = 401
            throw error
        }

        const subscriptions = await Subscription.find({ user: req.params.id })

        res.status(200).json({ success: true, data: subscriptions })
        
    } catch (error) {
        next(error)
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const { id } = req.params

        const subscription = await Subscription.findById(id)

        if(subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to edit this subscription')
            error.status = 401
            throw error
        }

        if(!subscription) {
            const error = new Error(`Subscription ${id} not found`)
            error.status = 404
            throw error
        }

        const allowedUpdates = [
            'name',
            'price',
            'currency',
            'frequency',
            'category',
            'paymentMethod',
            'status',
            'startDate',
            'renewalDate'
        ]

        for (let key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                subscription[key] = req.body[key]
            }
        }

        await subscription.save()
        
        res.status(200).json({ success: true, data: subscription })
        
    } catch (error) {
        next(error)
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const { id } = req.params

        const subscription = await Subscription.findById(id)

        if(subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not authorized to delete this subscription')
            error.status = 401
            throw error
        }

        if(!subscription) {
            const error = new Error(`Subscription ${id} not found`)
            error.status = 404
            throw error
        }

        await subscription.deleteOne()
        
        res.status(200).json({ success: true, data: `subscription ${id} deleted` })
        
    } catch (error) {
        next(error)
    }
}

export const getSubscription = async (req, res, next) => {
    try {
        const { id } = req.params

        const subscription = await Subscription.findById(id)

        if(subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not the owner of this subscription')
            error.status = 401
            throw error
        }

        if(!subscription) {
            const error = new Error(`Subscription ${id} not found`)
            error.status = 404
            throw error
        }

        res.status(200).json({ success: true, data: subscription })
        
    } catch (error) {
        next(error)
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.params

        const subscription = await Subscription.findById(id)

        if(subscription.user.toString() !== req.user.id) {
            const error = new Error('You are not the owner of this subscription')
            error.status = 401
            throw error
        }

        if(!subscription) {
            const error = new Error(`Subscription ${id} not found`)
            error.status = 404
            throw error
        }

        subscription.status = "cancelled"
        await subscription.save()

        res.status(200).json({ success: true, data: subscription })
        
    } catch (error) {
        next(error)
    }
}

export const upcomingRenewals = async (req, res, next) => {
    try {
        
        const userId = req.user.id

        const today = new Date()
        const in15days = new Date()
        in15days.setDate(today.getDate() + 15)

        const subscriptions = await Subscription.find({
            user: userId,
            status: 'active',
            renewalDate: {
                $gte: today,
                $lte: in15days
            }
        })

        if(subscriptions.length === 0) {
            res.status(200).json({ success: true, data: "No subscriptions to renew in the next 15 days" })
        }else{
            console.log(subscriptions)
            res.status(200).json({ success: true, data: subscriptions })
        }
        
    } catch (error) {
        next(error)
    }
}
