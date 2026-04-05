/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { ObjectId } from 'mongodb'; // Adjust this import path if needed
import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from '#@/lib/connection/mongodb';
import { EspecimenType } from '#@/lib/types/especimenTypes';
import { revalidatePath, revalidateTag } from 'next/cache';

// --- UPSERT ACTIONS ---

async function upsertSpecimenToDB(
  {
    data
  }: { data: EspecimenType }
) {
  try {
    const client = await clientPromise;
    const database = client.db(
      'botany_db'
    );
    const specimens = database.collection<EspecimenType>(
      'plantas_medicinales'
    );

    const {
      _id,
      ...updateData
    } = data as any;

    const query = _id
      ? {
          _id: new ObjectId(
            _id
          ),
        }
      : {
          nombreCientifico: data.nombreCientifico,
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
  }: { data: EspecimenType }
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
    ) as EspecimenType[];

    const {
      _id: _, ...jsonSafeData
    } = data as any;

    const plantIndex = plantList.findIndex(
      (
        plant
      ) => {
        return plant.nombreCientifico === jsonSafeData.nombreCientifico;
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
  }: { data: EspecimenType }
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
    nombreCientifico,
  }: {
    id?             : string;
    nombreCientifico: string;
  }
) {
  try {
    const client = await clientPromise;
    const database = client.db(
      'botany_db'
    );
    const specimens = database.collection<EspecimenType>(
      'plantas_medicinales'
    );

    const query = id
      ? {
          _id: new ObjectId(
            id
          ),
        }
      : {
          nombreCientifico,
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
    nombreCientifico,
  }: {
    nombreCientifico: string;
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
    ) as EspecimenType[];

    const initialLength = plantList.length;
    plantList = plantList.filter(
      (
        plant
      ) => {
        return plant.nombreCientifico !== nombreCientifico;
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
    nombreCientifico,
  }: {
    id?             : string;
    nombreCientifico: string;
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
          nombreCientifico,
        }
      ),
      deleteSpecimenFromJSON(
        {
          nombreCientifico,
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
