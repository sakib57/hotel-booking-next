import React from 'react'
import { Input } from './ui/Input'
import { Search } from 'lucide-react'

const SearchInput = () => {
  return (
    <div className='relative hidden sm:block'>
        <Search className='absolute h-4 w-4 top-3 left-4 text-muted-foreground'/>
        <Input placeholder='Search' className='pl-10 bg-primary/10'/>
    </div>
  )
}

export default SearchInput