// android/app/src/main/java/com/alirizvi512/mysdhapp/ContactPickerModule.kt
package com.alirizvi512.mysdhapp

import android.app.Activity
import android.content.Intent
import android.provider.ContactsContract
import com.facebook.react.bridge.*

class ContactPickerModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext) {

  private var pendingPromise: Promise? = null
  private val REQ = 4242

  override fun getName() = "ContactPicker"

  private val activityEventListener = object : BaseActivityEventListener() {
    override fun onActivityResult(
      activity: Activity,
      requestCode: Int,
      resultCode: Int,
      data: Intent?
    ) {
      if (requestCode != REQ) return
      val promise = pendingPromise ?: return.also { pendingPromise = null }

      if (resultCode != Activity.RESULT_OK || data == null) {
        promise.resolve(null)
        pendingPromise = null
        return
      }

      val uri = data.data
      if (uri == null) {
        promise.resolve(null)
        pendingPromise = null
        return
      }

      val cursor = reactContext.contentResolver.query(uri, null, null, null, null)
      cursor?.use {
        val nameIdx  = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
        val phoneIdx = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
        if (it.moveToFirst()) {
          val map = Arguments.createMap()
          if (nameIdx  >= 0) map.putString("name",  it.getString(nameIdx))
          if (phoneIdx >= 0) map.putString("phone", it.getString(phoneIdx))
          promise.resolve(map)
        } else {
          promise.resolve(null)
        }
      } ?: promise.resolve(null)

      pendingPromise = null
    }
  }

  init {
    reactContext.addActivityEventListener(activityEventListener)
  }

  @ReactMethod
fun pick(promise: Promise) {
  val activity = reactContext.currentActivity ?: run {   // ← use reactContext.currentActivity
    promise.reject("NO_ACTIVITY", "No current activity")
    return
  }
  if (pendingPromise != null) {
    promise.reject("BUSY", "Picker already open")
    return
  }
  pendingPromise = promise

  val intent = Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI).apply {
    type = ContactsContract.CommonDataKinds.Phone.CONTENT_TYPE
  }
  activity.startActivityForResult(intent, REQ)
}

@ReactMethod
fun getContacts(page: Int, pageSize: Int, query: String?, promise: Promise) {
  try {
    val resolver = reactContext.contentResolver
    val projection = arrayOf(
      ContactsContract.CommonDataKinds.Phone.CONTACT_ID,
      ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
      ContactsContract.CommonDataKinds.Phone.NUMBER,
      ContactsContract.CommonDataKinds.Phone.PHOTO_THUMBNAIL_URI
    )

    val selection: String?
    val selectionArgs: Array<String>?

    if (!query.isNullOrBlank()) {
      selection = "(" +
        ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " LIKE ? OR " +
        ContactsContract.CommonDataKinds.Phone.NUMBER       + " LIKE ?" +
      ")"
      val like = "%$query%"
      selectionArgs = arrayOf(like, like)
    } else {
      selection = null
      selectionArgs = null
    }

    val sortOrder = ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " COLLATE NOCASE ASC"

    resolver.query(
      ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
      projection,
      selection,
      selectionArgs,
      sortOrder
    ).use { cursor ->
      val result = Arguments.createArray()
      if (cursor == null) {
        promise.resolve(result); return
      }

      val idIdx    = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.CONTACT_ID)
      val nameIdx  = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
      val phoneIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
      val photoIdx = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.PHOTO_THUMBNAIL_URI)

      // Collect all, then paginate in-memory (simpler + predictable)
      // Also dedupe by CONTACT_ID (first number wins)
      val seen = HashSet<String>()
      val all  = ArrayList<WritableMap>()

      while (cursor.moveToNext()) {
        val id    = if (idIdx   >= 0) cursor.getString(idIdx)   else null
        val name  = if (nameIdx >= 0) cursor.getString(nameIdx) else null
        val phone = if (phoneIdx>= 0) cursor.getString(phoneIdx)else null
        val photo = if (photoIdx>= 0) cursor.getString(photoIdx)else null

        if (id.isNullOrBlank() || name.isNullOrBlank() || phone.isNullOrBlank()) continue
        if (seen.contains(id)) continue
        seen.add(id)

        val m = Arguments.createMap()
        m.putString("id", id)
        m.putString("name", name)
        m.putString("phone", phone)
        if (!photo.isNullOrBlank()) m.putString("avatar", photo)
        all.add(m)
      }

      val from = (page.coerceAtLeast(0)) * pageSize.coerceAtLeast(1)
      val to   = (from + pageSize).coerceAtMost(all.size)
      val slice = if (from < to) all.subList(from, to) else emptyList()

      slice.forEach { result.pushMap(it) }

      val meta = Arguments.createMap().apply {
        putInt("total", all.size)
        putInt("page", page)
        putInt("pageSize", pageSize)
        putBoolean("hasNextPage", to < all.size)
      }

      val out = Arguments.createMap()
      out.putArray("data", result)
      out.putMap("meta", meta)
      promise.resolve(out)
    }
  } catch (e: Exception) {
    promise.reject("CONTACTS_ERROR", e)
  }
}
}
