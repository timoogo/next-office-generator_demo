import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Link from "next/link";
import fs from 'fs';

import prisma from "@/prisma/prisma";

import { GenericPageProps } from "../../../../types/GenericProp";
import {
  capitalizeAndRemoveLast,
  getModelProperties,
} from "../../../../utils";


const GenericDetails: NextPage<GenericPageProps> = ({
  item,
  entityConfig,
  modelProperties,
}) => {
  if (!entityConfig) {
    return <div>Loading or Invalid Configuration...</div>;
  }

  const pageTitle = `${entityConfig.entityName}'s Dashboard`;

  if (!item) {
    return <div>{entityConfig.entityName} introuvable</div>;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div>
        <h1>Model: {entityConfig.displayNameProperty.toString()}</h1>
        {modelProperties.map(key => {
          return (<>
            <p>{key} : {item[key]}</p>
          </>);
        })}
      </div>
      <div>
        <Link href={`/${entityConfig.entityName}/edit/${item.id}`}>Edit</Link>
      </div>
    </>
  );
};

type ServerSideProps = {
  params: {
    id: string;
    entity: string;    
  }
}

export async function getServerSideProps(params: ServerSideProps) {
  const { id, entity } = params.params;
  // @ts-ignore
  const arrEntity = [...entity];
  arrEntity.pop()
  const tableName = arrEntity.join('')
  const displayName = capitalizeAndRemoveLast(entity);
  const modelProperties = await getModelProperties(fs, displayName);

  // @ts-ignore
  const item = await prisma[tableName].findUnique({
    where: {
      id: Number(id),
    },
  });

  return {
    props: {
      item,
      modelProperties,
      entityConfig: {
        entityName: tableName,
        displayNameProperty: displayName,
        entityPath: entity
      },
    },
  };
}

export default GenericDetails;
