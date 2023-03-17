import React from 'react'
import { Collapse, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { PlantsCollection } from '../../types'

type Props = {
  plantsCollection: PlantsCollection
}

export function PlantsCollectionOverview({ plantsCollection }: Props) {
  return (
    <>
      <h4>Name: {plantsCollection.name}</h4>
      <h4>
        Created At: {new Date(plantsCollection.created_at).toLocaleString()}
      </h4>
      {plantsCollection.created_at != plantsCollection.updated_at ? (
        <h4>
          Updated At: {new Date(plantsCollection.updated_at).toLocaleString()}
        </h4>
      ) : null}
      {plantsCollection.plants != undefined ? (
        <>
          <h4>Plants</h4>
          <Collapse in={true}>
            <ListGroup className='list-group-flush'>
              {plantsCollection.plants.map((plant) => (
                <Link to={`/plant/${plant.id}`} key={plant.id}>
                  <ListGroup.Item variant='dark'>{plant.name}</ListGroup.Item>
                </Link>
              ))}
            </ListGroup>
          </Collapse>
        </>
      ) : null}
    </>
  )
}
