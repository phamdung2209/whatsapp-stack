import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Id } from '../../../convex/_generated/dataModel'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { ImageIcon, MessageSquareDiff } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { previewImg, readFileAsDataURL } from '~/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import toast from 'react-hot-toast'

const UserListDialog = () => {
    const [selectedUsers, setSelectedUsers] = useState<Id<'users'>[]>([])
    const [groupName, setGroupName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [renderedImage, setRenderedImage] = useState('')

    const imgRef = useRef<HTMLInputElement>(null)
    const dialogCloseRef = useRef<HTMLButtonElement>(null)

    const createConversation = useMutation(api.conversations.createConversation)
    const me = useQuery(api.users.getMe)
    const generateUploadUrl = useMutation(api.conversations.generateUploadUrl)
    const users = useQuery(api.users.getUsers)

    useEffect(() => {
        if (!selectedImage) return setRenderedImage('')

        // const updateRenderedImage = async () => {
        //     const dataURL = await readFileAsDataURL(selectedImage!)
        //     setRenderedImage(dataURL)
        // }

        // updateRenderedImage()
        setRenderedImage(previewImg(selectedImage))

        return () => {
            URL.revokeObjectURL(renderedImage)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImage])
    console.log('selectedImage', selectedImage)

    const handleCreateConversation = async () => {
        if (selectedUsers.length === 0) return
        setIsLoading(true)
        try {
            const isGroup = selectedUsers.length > 1

            let conversationId
            if (!isGroup) {
                conversationId = await createConversation({
                    participants: [...selectedUsers, me?._id!],
                    isGroup: false,
                })
            } else {
                const postUrl = await generateUploadUrl()

                const res = await fetch(postUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': selectedImage?.type! },
                    body: selectedImage,
                })
                const { storageId } = await res.json()
                // console.log('storageId', storageId)

                conversationId = await createConversation({
                    participants: [...selectedUsers, me?._id!],
                    isGroup: true,
                    admin: me?._id!,
                    groupName,
                    groupImage: storageId,
                })
            }
            dialogCloseRef.current?.click()
            setSelectedUsers([])
            setGroupName('')
            setSelectedImage(null)
        } catch (error: any) {
            console.log('error', error.message)
            toast.error('Failed to create conversation')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <MessageSquareDiff size={20} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    {/* TODO: <DialogClose /> will be here */}
                    <DialogClose ref={dialogCloseRef} />
                    <DialogTitle>USERS</DialogTitle>
                </DialogHeader>

                <DialogDescription>Start a new chat</DialogDescription>
                {renderedImage && (
                    <div className="w-16 h-16 relative mx-auto">
                        <Image src={renderedImage} fill alt="user image" className="rounded-full object-cover" />
                    </div>
                )}
                {/* TODO: input file */}
                {selectedUsers.length > 1 && (
                    <>
                        <Input
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <input
                            accept="image/*"
                            type="file"
                            ref={imgRef}
                            hidden
                            onChange={(e) => setSelectedImage(e.target.files![0])}
                        />
                        <Button
                            className="flex gap-2"
                            onClick={() => {
                                imgRef.current?.click()
                            }}
                        >
                            <ImageIcon size={20} />
                            Group Image
                        </Button>
                    </>
                )}
                <div className="flex flex-col gap-3 overflow-auto max-h-60">
                    {users?.map((user) => (
                        <div
                            key={user._id}
                            className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user._id as Id<'users'>) ? 'bg-green-primary' : ''}`}
                            onClick={() => {
                                if (selectedUsers.includes(user._id as Id<'users'>)) {
                                    setSelectedUsers(selectedUsers.filter((id) => id !== user._id))
                                } else {
                                    setSelectedUsers([...selectedUsers, user._id as Id<'users'>])
                                }
                            }}
                        >
                            <Avatar className="overflow-visible">
                                {user.isOnline && (
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground" />
                                )}

                                <AvatarImage src={user.image} className="rounded-full object-cover" />
                                <AvatarFallback>
                                    <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full"></div>
                                </AvatarFallback>
                            </Avatar>

                            <div className="w-full ">
                                <div className="flex items-center justify-between">
                                    <p className="text-md font-medium">{user.name || user.email.split('@')[0]}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between">
                    <Button variant={'outline'}>Cancel</Button>
                    <Button
                        disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
                        onClick={handleCreateConversation}
                    >
                        {/* spinner */}
                        {isLoading ? (
                            <div className="w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin" />
                        ) : (
                            'Create'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default UserListDialog
