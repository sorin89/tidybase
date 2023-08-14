'use client'
import { useState } from "react"
import { FaImdb } from "react-icons/fa";
import { BiSun, BiMoon, BiSortAlt2 } from "react-icons/bi";
import { PiClockDuotone } from "react-icons/pi";
import { HiViewList, HiViewGrid } from "react-icons/hi";
import { Button, IconButton, ButtonGroup, Input, Stack, Text, useColorMode, HStack, Box, Flex, Select } from '@chakra-ui/react'
import Image from 'next/image'

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export default function Home() {
  const [results, setResults] = useState<Movie[]>([])
  const [query, setQuery] = useState<string>('')
  const [view, setView] = useState<string>('list')

  async function search(q: string) {
    setQuery(q)
    const response = await fetch(`/api/search?q=${q}`);
    const results = await response.json();
    setResults(results)
  }

  function setSearch(value: string) {
    if(value == '') setResults([])
    setQuery(value)
  }
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <main className="max-w-5xl py-10 mx-4 lg:mx-auto">
      <HStack spacing="10" className="mb-10 text-center">
        <Text fontSize="4xl" as="b" className="cursor-default">Tidybase</Text>
        <IconButton aria-label="Color mode" onClick={toggleColorMode} className="text-3xl rounded-full" icon={colorMode === 'light' ? <BiSun/> : <BiMoon/> } />
      </HStack>
      <div className="flex flex-wrap items-center">
        <Text className="mr-2">Examples: </Text>
        <Button size="sm" className="rounded-xl border mx-1 my-1" onClick={() => search('Matrix')}>Matrix</Button>
        <Button size="sm" className="rounded-xl border mx-1 my-1" onClick={() => search('Matrix Reloaded')}>Matrix Reloaded</Button>
        <Button size="sm" className="rounded-xl border mx-1 my-1" onClick={() => search('Matrix Revolutions')}>Matrix Revolutions</Button>
      </div>
      <Input 
        placeholder="🔍 search"
        type="search"
        size="md"
        value={query} 
        onChange={(e) => setSearch(e.target.value)} 
        onKeyUp={e=> e.key === "Enter" && search(query)} 
        className="my-10"
      />
      <div>
        {results && results.length != 0 &&
          <div>
            <Box className="rounded-xl" bg={colorMode === 'light' ? 'gray.50' : 'gray.700' }>
              <Flex>
                <Box flex="1" className="flex p-4 items-center">{results.length} results</Box>
                <Box className="p-4">
                  <HStack>
                    <Select icon={<BiSortAlt2/>}>
                      <option>Default</option>
                      <option>Title (A&raquo;Z)</option>
                      <option>Title (Z&raquo;A)</option>
                      <option>Year</option>
                      <option>Type</option>
                    </Select>
                  </HStack>
                </Box>
                <Box className="p-4 rounded-r-xl">
                  <ButtonGroup isAttached variant="outline">
                    <IconButton isActive={view == 'list'} onClick={() => setView('list')} aria-label='List view' icon={<HiViewList/>} />
                    <IconButton isActive={view == 'grid'} onClick={() => setView('grid')} aria-label='Grid View' icon={<HiViewGrid/>} />
                  </ButtonGroup>
                </Box>
              </Flex>
            </Box>
            <div className={`${view == 'grid' && 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
            {results.map((r, index) => (
                <div key={index} className={`my-2 flex ${view == 'grid' && 'flex-col'} items-center p-2 rounded-md cursor-pointer ${colorMode === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700' }`}>
                  <img 
                    src={`${r.Poster != 'N/A' ? r.Poster : 'poster.png'}`} 
                    className={`${view == 'grid' ? 'w-full' : 'w-10'} rounded-lg mx-2 border border-gray-400`} 
                    alt={`Poster for ${r.Title}`} 
                  />
                  <div className={`flex-grow font-semibold ${view == 'grid' && 'text-center'}`}>{r.Title}</div>
                  <div className="flex items-center px-5"><PiClockDuotone className="mr-1" /> {r.Year}</div>
                  <a href={`https://www.imdb.com/title/${r.imdbID}/`} target="_blank">
                    <div className="flex items-center px-5 ">
                      <FaImdb className="mr-1" /> {r.imdbID}
                    </div>
                  </a>
                </div>
            ))}
            </div>
          </div>
        }
      </div>
    </main>
  )
}
