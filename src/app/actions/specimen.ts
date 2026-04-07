/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { ObjectId } from 'mongodb'; // Adjust this import path if needed
import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from '#@/lib/connection/mongodb';
import { revalidatePath, revalidateTag } from 'next/cache';
import { TemplateType } from '#@/lib/types/template';

// --- UPSERT ACTIONS ---

async function upsertSpecimenToDB(
  {
    data
  }: { data: TemplateType }
) {
  try {
    const client = await clientPromise;
    const DB_NAME = process.env.DATABASE_NAME ?? 'template_db';
    const COLLECTION_NAME = process.env.COLLECTION_NAME ?? 'plantas_medicinales';
    const database = client.db(
      DB_NAME
    );
    const specimens = database.collection<TemplateType>(
      COLLECTION_NAME
    );

    const {
      _id,
      ...updateData
    } = data as any;

    const query: any = _id
      ? {
          _id: new ObjectId(
            _id
          ),
        }
      : {
          title: data.title,
        };

    const result = await specimens.findOneAndUpdate(
      query,
      {
        $set: updateData,
      },
      {
        returnDocument: 'after',
        upsert        : true,
      },
    );

    if ( !result ) {
      throw new Error(
        'Failed to update or create document in MongoDB.'
      );
    }

    return {
      success: true,
      data   : {
        ...result,
        _id: result._id.toString(),
      },
    };
  } catch ( error ) {
    console.error(
      'Database Error:', error
    );

    return {
      success: false,
      error  : error instanceof Error
        ? error.message
        : 'Unknown database error',
    };
  }
}

async function upsertSpecimenToJSON(
  {
    data
  }: { data: TemplateType }
) {
  try {
    const jsonFilePath = path.join(
      process.cwd(),
      'src/lib/json/plantListDB.json',
    );
    const fileContents = await fs.readFile(
      jsonFilePath, 'utf8'
    );
    const plantList = JSON.parse(
      fileContents
    ) as TemplateType[];

    const {
      _id: _, ...jsonSafeData
    } = data as any;

    const plantIndex = plantList.findIndex(
      (
        plant
      ) => {
        return plant.title === jsonSafeData.title;
      }
    );

    if ( plantIndex !== -1 ) {
      plantList[ plantIndex ] = {
        ...plantList[ plantIndex ],
        ...jsonSafeData,
      };
    } else {
      plantList.push(
        jsonSafeData
      );
    }

    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(
        plantList, null, 2
      ),
      'utf8',
    );

    return {
      success: true,
      data   : data,
    };
  } catch ( error ) {
    console.error(
      'File System Error:', error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown file system error',
    };
  }
}

export async function upsertSpecimen(
  {
    data
  }: { data: TemplateType }
) {
  const [
    dbResult,
    fileResult
  ] = await Promise.all(
    [
      upsertSpecimenToDB(
        {
          data,
        }
      ),
      upsertSpecimenToJSON(
        {
          data,
        }
      ),
    ]
  );

  if ( dbResult.success && fileResult.success ) {
    revalidatePath(
      '/hierbas', 'layout'
    );
    revalidateTag(
      'hierbas', 'max'
    );

    return {
      success: true,
      data   : dbResult.data,
      failed : 'none',
    };
  }

  let failed: 'database' | 'file' | 'both' = 'both';

  if ( dbResult.success && !fileResult.success ) {
    failed = 'file';
  } else if ( !dbResult.success && fileResult.success ) {
    failed = 'database';
  }

  const errors = {
    ...( dbResult.error && {
      db: dbResult.error,
    } ),
    ...( fileResult.error && {
      file: fileResult.error,
    } ),
  };

  return {
    success: false,
    failed,
    errors,
    data   : dbResult.success
      ? dbResult.data
      : undefined,
  };
}

// --- DELETE ACTIONS ---

async function deleteSpecimenFromDB(
  {
    id,
    title,
  }: {
    id?  : string;
    title: string;
  }
) {
  try {
    const client = await clientPromise;
    const DB_NAME = process.env.DATABASE_NAME ?? 'botany_db';
    const COLLECTION_NAME = process.env.COLLECTION_NAME ?? 'plantas_medicinales';
    const database = client.db(
      DB_NAME
    );
    const specimens = database.collection<TemplateType>(
      COLLECTION_NAME
    );

    const query: any = id
      ? {
          _id: new ObjectId(
            id
          ),
        }
      : {
          title,
        };
    const result = await specimens.deleteOne(
      query
    );

    if ( result.deletedCount === 0 ) {
      throw new Error(
        'No document found to delete in MongoDB.'
      );
    }

    return {
      success: true,
    };
  } catch ( error ) {
    console.error(
      'Database Delete Error:', error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown database deletion error',
    };
  }
}

async function deleteSpecimenFromJSON(
  {
    title,
  }: {
    title: string;
  }
) {
  try {
    const jsonFilePath = path.join(
      process.cwd(),
      'src/lib/json/plantListDB.json',
    );
    const fileContents = await fs.readFile(
      jsonFilePath, 'utf8'
    );
    let plantList = JSON.parse(
      fileContents
    ) as TemplateType[];

    const initialLength = plantList.length;
    plantList = plantList.filter(
      (
        plant
      ) => {
        return plant.title !== title;
      }
    );

    if ( plantList.length === initialLength ) {
      throw new Error(
        'No document found to delete in JSON.'
      );
    }

    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(
        plantList, null, 2
      ),
      'utf8',
    );

    return {
      success: true,
    };
  } catch ( error ) {
    console.error(
      'File System Delete Error:', error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown file system deletion error',
    };
  }
}

export async function deleteSpecimen(
  {
    id,
    title,
  }: {
    id?  : string;
    title: string;
  }
) {
  const [
    dbResult,
    fileResult
  ] = await Promise.all(
    [
      deleteSpecimenFromDB(
        {
          id,
          title,
        }
      ),
      deleteSpecimenFromJSON(
        {
          title,
        }
      ),
    ]
  );

  if ( dbResult.success && fileResult.success ) {
    revalidatePath(
      '/hierbas', 'layout'
    );

    return {
      success: true,
      failed : 'none',
    };
  }

  let failed: 'database' | 'file' | 'both' = 'both';

  if ( dbResult.success && !fileResult.success ) {
    failed = 'file';
  } else if ( !dbResult.success && fileResult.success ) {
    failed = 'database';
  }

  const errors = {
    ...( dbResult.error && {
      db: dbResult.error,
    } ),
    ...( fileResult.error && {
      file: fileResult.error,
    } ),
  };

  return {
    success: false,
    failed,
    errors,
  };
}
