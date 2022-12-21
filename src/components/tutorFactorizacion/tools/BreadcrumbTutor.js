import React from 'react'
//import {Breadcrumb,Card} from 'react-bootstrap'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
  } from "@chakra-ui/react"

export const BreadcrumbTutor = ({root,item}) => {
    return (
            <>
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink>{root}</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink>{item}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <br/>
            </>
    )
}