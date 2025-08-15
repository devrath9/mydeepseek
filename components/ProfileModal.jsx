import { assets } from '@/assets/assets'
import Image from 'next/image'

const ProfileModal = ({username, email,logout}) => {
  return (
    <div className="w-80 rounded-xl border border-gray-200 shadow-md bg-white overflow-hidden">
      
      {/* Profile Section */}
      <div className="flex items-center p-4 space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
          {username.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{username}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Actions */}
      <div className="flex flex-col">
        <div className="flex items-center px-5 py-3  gap-5 text-sm text-gray-700 hover:bg-gray-50">
          <Image src={assets.user_icon} alt='' className='w-5 h-5' />
          {username}
        </div>
        <div className="border-t border-gray-200" />
        <button onClick={logout}
          className="flex items-center px-5 py-3 gap-6 text-sm text-gray-700 hover:bg-gray-50">
          <Image src={assets.logout_icon} alt='' className='w-5 h-5' />
          Sign out
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Footer */}
      <div className="px-4 py-3 text-center text-xs text-gray-400 bg-gradient-to-b from-white to-orange-100 ">
        <p>
          Secured by{" "}
          <span className="font-semibold text-gray-500">clerk</span>
        </p>
        <p className="text-orange-500 font-medium">Development mode</p>
      </div>
    </div>
  )
}

export default ProfileModal
