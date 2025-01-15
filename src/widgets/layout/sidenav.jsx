import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button, Collapse, IconButton, Typography } from '@material-tailwind/react'
import { setOpenSidenav, useMaterialTailwindController } from '@/context'
import { ArrowSmallDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export const sidenavTypes = {
  dark: 'bg-gradient-to-br from-gray-800 to-gray-900',
  white: 'bg-white shadow-sm',
  transparent: 'bg-transparent',
}

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController()
  const { sidenavColor, sidenavType, openSidenav } = controller

  const [openAccordion, setOpenAccordion] = useState('')

  const handleToggle = (id) => {
    if (id === openAccordion) {
      setOpenAccordion('')
    } else {
      setOpenAccordion(id)
    }
  }

  return (
      <aside
          className={`${sidenavTypes[sidenavType]} ${
              openSidenav ? 'translate-x-0' : '-translate-x-80'
          } fixed inset-0 z-50 my-4 ml-4 
       w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
      >
        <div className={`relative ove`}>
          <Link to="/" className="py-6 px-8 text-center">
            <Typography variant="h6" color={sidenavType === 'dark' ? 'white' : 'blue-gray'}>
              {brandName}
            </Typography>
          </Link>
          <IconButton
              variant="text"
              color="white"
              size="sm"
              ripple={false}
              className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
              onClick={() => setOpenSidenav(dispatch, false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
          </IconButton>
        </div>
        <div
            style={{ scrollbarWidth: 'thin' }}
            className="my-4 mx-1 px-1 h-[calc(100vh-150px)] scroll-m-1 overflow-y-scroll"
        >
          {routes.map(({ layout, title, pages }, key) => (
              <ul key={key} className="mb-4 flex flex-col gap-1">
                {title && (
                    <li className="mx-3.5 mt-4 mb-2">
                      <Typography
                          variant="small"
                          color={sidenavType === 'dark' ? 'white' : 'blue-gray'}
                          className="font-black uppercase opacity-75"
                      >
                        {title}
                      </Typography>
                    </li>
                )}
                {pages.map(({ icon, name, path, id, ...other }, index) => {
                  if (!other?.children) {
                    return (
                        <li key={index}>
                          <NavLink to={`/${layout}${path}`}>
                            {({ isActive }) => (
                                <Button
                                    onClick={() => handleToggle(id)}
                                    variant={isActive ? 'gradient' : 'text'}
                                    color={
                                      isActive ? sidenavColor : sidenavType === 'dark' ? 'white' : 'blue-gray'
                                    }
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                  {icon}
                                  <Typography color="inherit" className="font-medium capitalize">
                                    {name}
                                  </Typography>
                                </Button>
                            )}
                          </NavLink>
                        </li>
                    )
                  } else {
                    return (
                        <li key={index}>
                          <Button
                              onClick={() => handleToggle(id)}
                              variant={openAccordion === id ? 'gradient' : 'text'}
                              color={
                                openAccordion === id
                                    ? sidenavColor
                                    : sidenavType === 'dark'
                                        ? 'white'
                                        : 'blue-gray'
                              }
                              className="flex items-center w-full gap-4 px-4 capitalize"
                              fullWidth
                          >
                            {icon}
                            <Typography color="inherit" className="font-medium capitalize">
                              {name}
                            </Typography>
                            <ArrowSmallDownIcon className="w-5 ml-auto h-5 text-inherit" />
                          </Button>

                          <Collapse open={openAccordion === id}>
                            {other?.children?.map((item, index) => {
                              return (
                                  <li
                                      style={{ width: 'calc(100% - 14px)', marginTop: index === 0 ? 3 : 0 }}
                                      key={index}
                                  >
                                    <NavLink to={`/${layout}${item?.path}`}>
                                      {({ isActive }) => (
                                          <Button
                                              variant={isActive ? 'gradient' : 'text'}
                                              color={
                                                isActive
                                                    ? sidenavColor
                                                    : sidenavType === 'dark'
                                                        ? 'white'
                                                        : 'blue-gray'
                                              }
                                              className="flex items-center gap-4 ml-3 px-4"
                                              fullWidth
                                          >
                                            {item?.icon}
                                            <Typography color="inherit" className="font-medium lowercase">
                                              {item?.name}
                                            </Typography>
                                          </Button>
                                      )}
                                    </NavLink>
                                  </li>
                              )
                            })}
                          </Collapse>
                        </li>
                    )
                  }
                })}
              </ul>
          ))}
        </div>
      </aside>
  )
}

Sidenav.defaultProps = {
  brandImg: '/img/logo-ct.png',
  brandName: 'Turon App Admin',
}

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

Sidenav.displayName = '/src/widgets/layout/sidnave.jsx'

export default Sidenav
