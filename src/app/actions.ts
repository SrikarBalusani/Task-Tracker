'use server'

import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Auth Actions
export async function verifyPin(pin: string) {
  const correctPin = process.env.EDIT_PIN
  if (pin === correctPin) {
    const cookieStore = await cookies()
    cookieStore.set('edit_mode', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' })
    return { success: true }
  }
  return { success: false }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('edit_mode')
  return { success: true }
}

export async function checkIsEditMode() {
  const cookieStore = await cookies()
  return cookieStore.get('edit_mode')?.value === 'true'
}

// Data Actions
export async function getDashboardData(dateStr: string) {
  // Try to find the day record
  let dayRecord = await prisma.dayRecord.findUnique({
    where: { date: dateStr },
    include: {
      entries: {
        include: { task: true },
        orderBy: { id: 'asc' }
      }
    }
  })

  if (!dayRecord) {
    // Lazy seeding
    const permanentTasks = await prisma.task.findMany({
      where: {
        isPermanent: true,
        isRetired: false
      },
      orderBy: { createdAt: 'asc' }
    })

    dayRecord = await prisma.dayRecord.create({
      data: {
        date: dateStr,
        entries: {
          create: permanentTasks.map(task => ({
            taskId: task.id,
            status: 'not_done',
            note: '',
            isCustom: false
          }))
        }
      },
      include: {
        entries: {
          include: { task: true },
          orderBy: { id: 'asc' }
        }
      }
    })
  }

  return dayRecord
}

export async function toggleTaskStatus(entryId: string, status: string) {
  const isEditMode = await checkIsEditMode()
  if (!isEditMode) return { success: false, error: 'Unauthorized' }

  await prisma.dayEntry.update({
    where: { id: entryId },
    data: { status }
  })
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTaskNote(entryId: string, note: string) {
  const isEditMode = await checkIsEditMode()
  if (!isEditMode) return { success: false, error: 'Unauthorized' }

  await prisma.dayEntry.update({
    where: { id: entryId },
    data: { note }
  })
  revalidatePath('/dashboard')
  return { success: true }
}

export async function addCustomTask(dateStr: string, name: string, makePermanent: boolean) {
  const isEditMode = await checkIsEditMode()
  if (!isEditMode) return { success: false, error: 'Unauthorized' }

  // Create the task
  const task = await prisma.task.create({
    data: {
      name,
      isPermanent: makePermanent,
    }
  })

  // Get the day record (create if doesn't exist just in case)
  let dayRecord = await prisma.dayRecord.findUnique({ where: { date: dateStr } })
  if (!dayRecord) {
     dayRecord = await getDashboardData(dateStr) as any
  }

  await prisma.dayEntry.create({
    data: {
      dayRecordId: dayRecord!.id,
      taskId: task.id,
      isCustom: !makePermanent
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}

export async function removePermanentTask(taskId: string) {
  const isEditMode = await checkIsEditMode()
  if (!isEditMode) return { success: false, error: 'Unauthorized' }

  await prisma.task.update({
    where: { id: taskId },
    data: { isPermanent: false }
  })
  revalidatePath('/dashboard')
  return { success: true }
}

export async function retireTask(taskId: string) {
  const isEditMode = await checkIsEditMode()
  if (!isEditMode) return { success: false, error: 'Unauthorized' }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      isPermanent: false,
      isRetired: true,
      retiredAt: new Date()
    }
  })
  revalidatePath('/dashboard')
  revalidatePath('/hall-of-fame')
  return { success: true }
}

export async function getHallOfFame() {
  return await prisma.task.findMany({
    where: {
      isRetired: true
    },
    orderBy: { retiredAt: 'desc' }
  })
}

export async function getHistory() {
  return await prisma.dayRecord.findMany({
    include: {
      entries: {
        include: { task: true },
        orderBy: { id: 'asc' }
      }
    },
    orderBy: { date: 'desc' }
  })
}
