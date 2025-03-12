//@ts-check
import { listServiceInstances } from "@/client/api/instances";
import React from "react"
import { MdOutlineFolderOff } from "react-icons/md";
import InstanceList from "../InstanceList";

const ServiceList = ({ services }) => {
  

    return (
        <>
            {
                services?.length > 0 ?
                    <>
                        {
                            services?.map((n) => <ServiceItem
                                key={n?.id}
                                item={n}
                            />)
                        }
                    </> :
                    <>
                        <div className="w-full px-3 py-4 flex justify-center h-[320px]">
                            <div className="flex flex-col justify-center items-center">
                                <div><MdOutlineFolderOff size={20} /></div>
                                <div>No Data</div>
                            </div>
                        </div>

                    </>
            }

            
        </>
    )
}

const ServiceItem = ({ item }) => {

    const [list, setList] = React.useState([])

    const fetchInstances = async () => {
        try {
            let l = await listServiceInstances(item?.id)
            setList(l)
        } catch (e) {

        }
    }

    React.useEffect(() => {
        fetchInstances()
    }, [])

    return (
        <div className="border border-gray-200 rounded-xl w-full px-3 py-4 space-y-2">
            <div className="w-full flex justify-between">
                <div className="text-lg">{item?.name}</div>
                <div className="flex justify-end space-x-2">
                    
                </div>
            </div>
            <InstanceList 
                list={list}
            />
        </div>
    )
}
export default ServiceList