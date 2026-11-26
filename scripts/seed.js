require('dotenv').config()

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const connectDB = require('../src/db/db')
const userModel = require('../src/models/user.schema')
const courseModel = require('../src/models/courses.model')

const demoPassword = process.env.SEED_USER_PASSWORD || 'LearnHubDemo123!'

const demoUsers = [
    {username: 'demo.teacher', role: 'teacher'},
    {username: 'demo.student', role: 'student'},
    {username: 'demo.student2', role: 'student'}
]

const demoCourses = [
    {
        title: 'JavaScript Foundations',
        description: 'Learn core JavaScript concepts through practical examples and exercises.',
        instructor: 'Alex Morgan',
        category: 'Development',
        price: 799
    },
    {
        title: 'Design Fundamentals',
        description: 'Explore layout, color, typography, and visual design principles.',
        instructor: 'Jamie Lee',
        category: 'Design',
        price: 599
    },
    {
        title: 'Data Literacy for Everyone',
        description: 'Build confidence reading, analyzing, and communicating with data.',
        instructor: 'Taylor Kim',
        category: 'Data Science',
        price: 999
    }
]

const seed = async () => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Demo data cannot be seeded in production')
    }

    await connectDB()

    const hashedPassword = await bcrypt.hash(demoPassword, 10)
    let usersCreated = 0
    for (const user of demoUsers) {
        const result = await userModel.updateOne(
            {username: user.username},
            {$setOnInsert: {...user, password: hashedPassword}},
            {upsert: true}
        )
        usersCreated += result.upsertedCount
    }

    let coursesCreated = 0
    for (const course of demoCourses) {
        const existingCourse = await courseModel.exists({title: course.title})
        if (!existingCourse) {
            await courseModel.create(course)
            coursesCreated += 1
        }
    }

    console.log(`Seed complete: ${usersCreated} users and ${coursesCreated} courses added.`)
    console.log(`Demo users: ${demoUsers.map(user => user.username).join(', ')}`)
    console.log('Use SEED_USER_PASSWORD to override the local demo password.')
}

seed()
    .catch(error => {
        console.error('Failed to seed demo data:', error.message)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.disconnect()
    })
