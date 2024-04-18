'use client'

import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRef } from 'react'

const TasksPage = () => {
    const tasks = useQuery(api.tasks.getTasks)
    const deleteTask = useMutation(api.tasks.deleteTask)
    const addTask = useMutation(api.tasks.addTask)
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="p-10 flex flex-col gap-4">
            <h1 className="text-5xl">All tasks are here in real-time</h1>

            {tasks?.map((task) => (
                <div key={task._id} className="flex gap-2">
                    <span>{task.text}</span>
                    <button
                        onClick={async () => {
                            await deleteTask({ id: task._id })
                        }}
                    >
                        Delete Task
                    </button>
                </div>
            ))}

            <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault()
                    const value = inputRef.current?.value
                    if (value) {
                        addTask({
                            text: value,
                        })
                    }
                }}
            >
                <input ref={inputRef} type="text" placeholder="Add a task" />
            </form>
        </div>
    )
}

export default TasksPage
