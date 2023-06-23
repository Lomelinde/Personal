// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/*
 * SETUP
 * Use this section to set up the widget.
 * ======================================
 */

// To use weather, get a free API key at openweathermap.org/appid and paste it in between the quotation marks.
const apiKey = ""

// Set the locale code. Leave blank "" to match the device's locale. You can change the hard-coded text strings in the TEXT section below.
let locale = ""

// Set to true for fixed location, false to update location as you move around
const lockLocation = true

// The size of the widget preview in the app.
const widgetPreview = "medium"

// Set to true for an image background, false for no image.
const imageBackground = true

// Set to true to reset the widget's background image.
const forceImageUpdate = false

// Set the padding around each item. Default is 5.
const padding = 5

/*
 * LAYOUT
 * Decide what items to show on the widget.
 * ========================================
 */

// You always need to start with "row," and "column," items, but you can now add as many as you want.
// Adding left, right, or center will align everything after that. The default alignment is left.

// You can add a flexible vertical space with "space," or a fixed-size space like this: "space(50)"
// Align items to the top or bottom of columns by adding "space," before or after all items in the column.

// There are many possible items, including: date, greeting, events, current, future, battery, sunrise, and text("Your text here")
// Make sure to always put a comma after each item.

const items = [
  
  row,
  
    column,
    greeting,
    date,
    battery,
    text,
    
    column(98),
    current,
    sunrise,
    future,
  
]

/*
 * ITEM SETTINGS
 * Choose how each item is displayed.
 * ==================================
 */  
 
// DATE
// ====
const dateSettings = {

  // If set to true, date will become smaller when events are displayed.
  dynamicDateSize: false

  // If the date is not dynamic, should it be large or small?
  ,staticDateSize: "small"

  // Determine the date format for each date type. See docs.scriptable.app/dateformatter
  ,smallDateFormat: "MMMd日， EEEE"
  ,largeDateLineOne: "EEEE,"
  ,largeDateLineTwo: "MMMM d"
}

// SUNRISE
// =======
const sunriseSettings = {
  
  // How many minutes before/after sunrise or sunset to show this element. 0 for always.
  showWithin: 0
}

// WEATHER
// =======
const weatherSettings = {

  // Set to imperial for Fahrenheit, or metric for Celsius
  units: "metric"
  
  // Show the location of the current weather.
  ,showLocation: false
  
  // Show the text description of the current conditions.
  ,showCondition: false

  // Show today's high and low temperatures.
  ,showHighLow: true

  // Set the hour (in 24-hour time) to switch to tomorrow's weather. Set to 24 to never show it.
  ,tomorrowShownAtHour: 20
}

/*
 * TEXT
 * Change the language and formatting of text displayed.
 * =====================================================
 */  
 
// You can change the language or wording of any text in the widget.
const localizedText = {
  
  // The text shown if you add a greeting item to the layout.
  nightGreeting: "晚安！🐻"
  ,morningGreeting: "早上好！🐻"
  ,afternoonGreeting: "下午好！🐻"
  ,eveningGreeting: "晚上好！🐻"
  
  // The text shown if you add a future weather item to the layout, or tomorrow's events.
  ,nextHourLabel: "下一小时"
  ,tomorrowLabel: "明天"
     
}

// Set the font, size, and color of various text elements. Use iosfonts.com to find fonts to use. If you want to use the default iOS font, set the font name to one of the following: ultralight, light, regular, medium, semibold, bold, heavy, black, or italic.
const textFormat = {
  
  // Set the default font and color.
  defaultText: { size: 10, color: "ffffff", font: "regular" },
  
  // Any blank values will use the default.
  smallDate:   { size: 18, color: "", font: "semibold" },
  largeDate1:  { size: 30, color: "", font: "light" },
  largeDate2:  { size: 30, color: "", font: "light" },
  
  greeting:    { size: 20, color: "", font: "semibold" },
  
  largeTemp:   { size: 18, color: "", font: "light" },
  smallTemp:   { size: 13, color: "", font: "" },
  tinyTemp:    { size: 12, color: "", font: "" },
  
  customText:  { size: 14, color: "", font: "" },
  
  battery:     { size: 14, color: "", font: "medium" },
  sunrise:     { size: 13, color: "", font: "small" },
}

/*
 * WIDGET CODE
 * Be more careful editing this section. 
 * =====================================
 */

// Make sure we have a locale value.
if (locale == "" || locale == null) { locale = Device.locale() }

// Declare the data variables.
var eventData, locationData, sunData, weatherData

// Create global constants.
const currentDate = new Date()
const files = FileManager.local()

/*
 * CONSTRUCTION
 * ============
 */

// Set up the widget with padding.
const widget = new ListWidget()
const horizontalPad = padding < 10 ? 10 - padding : 10
const verticalPad = padding < 15 ? 15 - padding : 15
widget.setPadding(horizontalPad, verticalPad, horizontalPad, verticalPad)
widget.spacing = 0

// Set up the global variables.
var currentRow = {}
var currentColumn = {}

// Set up the initial alignment.
var currentAlignment = alignLeft

// Set up our items.
for (item of items) { await item(currentColumn) }

/*
 * BACKGROUND DISPLAY
 * ==================
 */

// If it's an image background, display it.
if (imageBackground) {
  
  // Determine if our image exists and when it was saved.
  const path = files.joinPath(files.documentsDirectory(), "weather-cal-image")
  const exists = files.fileExists(path)
  
  // If it exists and an update isn't forced, use the cache.
  if (exists && (config.runsInWidget || !forceImageUpdate)) {
    widget.backgroundImage = files.readImage(path)
  
  // If it's missing when running in the widget, use a gray background.
  } else if (!exists && config.runsInWidget) {
      widget.backgroundColor = Color.gray() 
    
  // But if we're running in app, prompt the user for the image.
  } else {
      const img = await Photos.fromLibrary()
      widget.backgroundImage = img
      files.writeImage(path, img)
  }
    
// If it's not an image background, show the gradient.
} else {
  let gradient = new LinearGradient()
  let gradientSettings = await setupGradient()
  
  gradient.colors = gradientSettings.color()
  gradient.locations = gradientSettings.position()
  
  widget.backgroundGradient = gradient
}

// Finish the widget and show a preview.
Script.setWidget(widget)
if (widgetPreview == "small") { widget.presentSmall() }
else if (widgetPreview == "medium") { widget.presentMedium() }
else if (widgetPreview == "large") { widget.presentLarge() }
Script.complete()

/*
 * LAYOUT FUNCTIONS
 * These functions manage spacing and alignment.
 * =============================================
 */

// Makes a new row on the widget.
function row(input = null) {

  function makeRow() {
    currentRow = widget.addStack()
    currentRow.layoutHorizontally()
    currentRow.setPadding(0, 0, 0, 0)
    currentColumn.spacing = 0
    
    // If input was given, make a column of that size.
    if (input > 0) { currentRow.size = new Size(0,input) }
  }
  
  // If there's no input or it's a number, it's being called in the layout declaration.
  if (!input || typeof input == "number") { return makeRow }
  
  // Otherwise, it's being called in the generator.
  else { makeRow() }
}

// Makes a new column on the widget.
function column(input = null) {
 
  function makeColumn() {
    currentColumn = currentRow.addStack()
    currentColumn.layoutVertically()
    currentColumn.setPadding(0, 0, 0, 0)
    currentColumn.spacing = 0
    
    // If input was given, make a column of that size.
    if (input > 0) { currentColumn.size = new Size(input,0) }
  }
  
  // If there's no input or it's a number, it's being called in the layout declaration.
  if (!input || typeof input == "number") { return makeColumn }
  
  // Otherwise, it's being called in the generator.
  else { makeColumn() }
}

// Create an aligned stack to add content to.
function align(column) {
  
  // Add the containing stack to the column.
  let alignmentStack = column.addStack()
  alignmentStack.layoutHorizontally()
  
  // Get the correct stack from the alignment function.
  let returnStack = currentAlignment(alignmentStack)
  returnStack.layoutVertically()
  return returnStack
}

// Create a right-aligned stack.
function alignRight(alignmentStack) {
  alignmentStack.addSpacer()
  let returnStack = alignmentStack.addStack()
  return returnStack
}

// Create a left-aligned stack.
function alignLeft(alignmentStack) {
  let returnStack = alignmentStack.addStack()
  alignmentStack.addSpacer()
  return returnStack
}

// Create a center-aligned stack.
function alignCenter(alignmentStack) {
  alignmentStack.addSpacer()
  let returnStack = alignmentStack.addStack()
  alignmentStack.addSpacer()
  return returnStack
}

// This function adds a space, with an optional amount.
function space(input = null) { 
  
  // This function adds a spacer with the input width.
  function spacer(column) {
  
    // If the input is null or zero, add a flexible spacer.
    if (!input || input == 0) { column.addSpacer() }
    
    // Otherwise, add a space with the specified length.
    else { column.addSpacer(input) }
  }
  
  // If there's no input or it's a number, it's being called in the column declaration.
  if (!input || typeof input == "number") { return spacer }
  
  // Otherwise, it's being called in the column generator.
  else { input.addSpacer() }
}

// Change the current alignment to right.
function right(x) { currentAlignment = alignRight }

// Change the current alignment to left.
function left(x) { currentAlignment = alignLeft }

// Change the current alignment to center.
function center(x) { currentAlignment = alignCenter }

/*
 * SETUP FUNCTIONS
 * These functions prepare data needed for items.
 * ==============================================
 */

// Set up the gradient for the widget background.
async function setupGradient() {
  
  // Requirements: sunrise
  if (!sunData) { await setupSunrise() }

  let gradient = {
    dawn: {
      color() { return [new Color("142C52"), new Color("1B416F"), new Color("62668B")] },
      position() { return [0, 0.5, 1] },
    },

    sunrise: {
      color() { return [new Color("274875"), new Color("766f8d"), new Color("f0b35e")] },
      position() { return [0, 0.8, 1.5] },
    },

    midday: {
      color() { return [new Color("3a8cc1"), new Color("90c0df")] },
      position() { return [0, 1] },
    },

    noon: {
      color() { return [new Color("b2d0e1"), new Color("80B5DB"), new Color("3a8cc1")] },
      position() { return [-0.2, 0.2, 1.5] },
    },

    sunset: {
      color() { return [new Color("32327A"), new Color("662E55"), new Color("7C2F43")] },
      position() { return [0.1, 0.9, 1.2] },
    },

    twilight: {
      color() { return [new Color("021033"), new Color("16296b"), new Color("414791")] },
      position() { return [0, 0.5, 1] },
    },

    night: {
      color() { return [new Color("16296b"), new Color("021033"), new Color("021033"), new Color("113245")] },
      position() { return [-0.5, 0.2, 0.5, 1] },
    },
  }

  const sunrise = sunData.sunrise
  const sunset = sunData.sunset

  // Use sunrise or sunset if we're within 30min of it.
  if (closeTo(sunrise)<=15) { return gradient.sunrise }
  if (closeTo(sunset)<=15) { return gradient.sunset }

  // In the 30min before/after, use dawn/twilight.
  if (closeTo(sunrise)<=45 && utcTime < sunrise) { return gradient.dawn }
  if (closeTo(sunset)<=45 && utcTime > sunset) { return gradient.twilight }

  // Otherwise, if it's night, return night.
  if (isNight(currentDate)) { return gradient.night }

  // If it's around noon, the sun is high in the sky.
  if (currentDate.getHours() == 12) { return gradient.noon }

  // Otherwise, return the "typical" theme.
  return gradient.midday
}

// Set up the locationData object.
async function setupLocation() {

  locationData = {}
  const locationPath = files.joinPath(files.documentsDirectory(), "weather-cal-loc")

  // If our location is unlocked or cache doesn't exist, ask iOS for location.
  var readLocationFromFile = false
  if (!lockLocation || !files.fileExists(locationPath)) {
    try {
      const location = await Location.current()
      const geocode = await Location.reverseGeocode(location.latitude, location.longitude, locale)
      locationData.latitude = location.latitude
      locationData.longitude = location.longitude
      locationData.locality = geocode[0].locality
      files.writeString(locationPath, location.latitude + "|" + location.longitude + "|" + locationData.locality)
    
    } catch(e) {
      // If we fail in unlocked mode, read it from the cache.
      if (!lockLocation) { readLocationFromFile = true }
      
      // We can't recover if we fail on first run in locked mode.
      else { return }
    }
  }
  
  // If our location is locked or we need to read from file, do it.
  if (lockLocation || readLocationFromFile) {
    const locationStr = files.readString(locationPath).split("|")
    locationData.latitude = locationStr[0]
    locationData.longitude = locationStr[1]
    locationData.locality = locationStr[2]
  }
}

// Set up the sunData object.
async function setupSunrise() {

  // Requirements: location
  if (!locationData) { await setupLocation() }

  // Set up the sunrise/sunset cache.
  const sunCachePath = files.joinPath(files.documentsDirectory(), "weather-cal-sun")
  const sunCacheExists = files.fileExists(sunCachePath)
  const sunCacheDate = sunCacheExists ? files.modificationDate(sunCachePath) : 0
  let sunDataRaw, afterSunset

  // If cache exists and was created today, use cached data.
  if (sunCacheExists && sameDay(currentDate, sunCacheDate)) {
    const sunCache = files.readString(sunCachePath)
    sunDataRaw = JSON.parse(sunCache)
    
    // Determine if it's after sunset.
    const sunsetDate = new Date(sunDataRaw.results.sunset)
    afterSunset = currentDate.getTime() - sunsetDate.getTime() > (45 * 60 * 1000)
  }
  
  // If we don't have data yet, or we need to get tomorrow's data, get it from the server.
  if (!sunDataRaw || afterSunset) {
    let tomorrowDate = new Date()
    tomorrowDate.setDate(currentDate.getDate() + 1)
    const dateToUse = afterSunset ? tomorrowDate : currentDate
    const sunReq = "https://api.sunrise-sunset.org/json?lat=" + locationData.latitude + "&lng=" + locationData.longitude + "&formatted=0&date=" + dateToUse.getFullYear() + "-" + (dateToUse.getMonth()+1) + "-" + dateToUse.getDate()
    sunDataRaw = await new Request(sunReq).loadJSON()
    files.writeString(sunCachePath, JSON.stringify(sunDataRaw))
  }

  // Store the timing values.
  sunData = {}
  sunData.sunrise = new Date(sunDataRaw.results.sunrise).getTime()
  sunData.sunset = new Date(sunDataRaw.results.sunset).getTime()
}

// Set up the weatherData object.
async function setupWeather() {

  // Requirements: location
  if (!locationData) { await setupLocation() }

  // Set up the cache.
  const cachePath = files.joinPath(files.documentsDirectory(), "weather-cal-cache")
  const cacheExists = files.fileExists(cachePath)
  const cacheDate = cacheExists ? files.modificationDate(cachePath) : 0
  var weatherDataRaw

  // If cache exists and it's been less than 60 seconds since last request, use cached data.
  if (cacheExists && (currentDate.getTime() - cacheDate.getTime()) < 60000) {
    const cache = files.readString(cachePath)
    weatherDataRaw = JSON.parse(cache)

  // Otherwise, use the API to get new weather data.
  } else {
    const weatherReq = "https://api.openweathermap.org/data/2.5/onecall?lat=" + locationData.latitude + "&lon=" + locationData.longitude + "&exclude=minutely,alerts&units=" + weatherSettings.units + "&lang=" + locale + "&appid=" + apiKey
    weatherDataRaw = await new Request(weatherReq).loadJSON()
    files.writeString(cachePath, JSON.stringify(weatherDataRaw))
  }

  // Store the weather values.
  weatherData = {}
  weatherData.currentTemp = weatherDataRaw.current.temp
  weatherData.currentCondition = weatherDataRaw.current.weather[0].id
  weatherData.currentDescription = weatherDataRaw.current.weather[0].main
  weatherData.todayHigh = weatherDataRaw.daily[0].temp.max
  weatherData.todayLow = weatherDataRaw.daily[0].temp.min

  weatherData.nextHourTemp = weatherDataRaw.hourly[1].temp
  weatherData.nextHourCondition = weatherDataRaw.hourly[1].weather[0].id

  weatherData.tomorrowHigh = weatherDataRaw.daily[1].temp.max
  weatherData.tomorrowLow = weatherDataRaw.daily[1].temp.min
  weatherData.tomorrowCondition = weatherDataRaw.daily[1].weather[0].id
}

/*
 * WIDGET ITEMS
 * These functions display items on the widget.
 * ============================================
 */

// Display the date on the widget.
async function date(column) {

  // Requirements: events (if dynamicDateSize is enabled)
  if (!eventData && dateSettings.dynamicDateSize) { await setupEvents() }

  // Set up the date formatter and set its locale.
  let df = new DateFormatter()
  df.locale = locale
  
  // Show small if it's hard coded, or if it's dynamic and events are visible.
  if (dateSettings.staticDateSize == "small" || (dateSettings.dynamicDateSize && eventData.eventsAreVisible)) {
    let dateStack = align(column)
    dateStack.setPadding(padding, padding, padding, padding)

    df.dateFormat = dateSettings.smallDateFormat
    let dateText = provideText(df.string(currentDate), dateStack, textFormat.smallDate)
    
  // Otherwise, show the large date.
  } else {
    let dateOneStack = align(column)
    df.dateFormat = dateSettings.largeDateLineOne
    let dateOne = provideText(df.string(currentDate), dateOneStack, textFormat.largeDate1)
    dateOneStack.setPadding(padding/2, padding, 0, padding)
    
    let dateTwoStack = align(column)
    df.dateFormat = dateSettings.largeDateLineTwo
    let dateTwo = provideText(df.string(currentDate), dateTwoStack, textFormat.largeDate2)
    dateTwoStack.setPadding(0, padding, padding, padding)
  }
}

// Display a time-based greeting on the widget.
async function greeting(column) {

  // This function makes a greeting based on the time of day.
  function makeGreeting() {
    const hour = currentDate.getHours()
    if (hour    < 5)  { return localizedText.nightGreeting }
    if (hour    < 12) { return localizedText.morningGreeting }
    if (hour-12 < 5)  { return localizedText.afternoonGreeting }
    if (hour-12 < 10) { return localizedText.eveningGreeting }
    return localizedText.nightGreeting
  }
  
  // Set up the greeting.
  let greetingStack = align(column)
  let greeting = provideText(makeGreeting(), greetingStack, textFormat.greeting)
  greetingStack.setPadding(padding, padding, padding, padding)
}

// Display events on the widget.
async function events(column) {

  // Requirements: events
  if (!eventData) { await setupEvents() }

  // If no events are visible, figure out what to do.
  if (!eventData.eventsAreVisible) { 
    const display = eventSettings.noEventBehavior
    
    // If it's a greeting, let the greeting function handle it.
    if (display == "greeting") { return await greeting(column) }
    
    // If it's a message, get the localized text.
    if (display == "message" && localizedText.noEventMessage.length) {
      const messageStack = align(column)
      messageStack.setPadding(padding, padding, padding, padding)
      provideText(localizedText.noEventMessage, messageStack, textFormat.noEvents)
    }
    
    // Whether or not we displayed something, return here.
    return
  }

// Display the current weather.
async function current(column) {

  // Requirements: weather and sunrise
  if (!weatherData) { await setupWeather() }
  if (!sunData) { await setupSunrise() }

  // Set up the current weather stack.
  let currentWeatherStack = column.addStack()
  currentWeatherStack.layoutVertically()
  currentWeatherStack.setPadding(0, 0, 0, 0)
  currentWeatherStack.url = "https://weather.com/weather/today/l/" + locationData.latitude + "," + locationData.longitude
  
  // If we're showing the location, add it.
  if (weatherSettings.showLocation) {
    let locationTextStack = align(currentWeatherStack)
    let locationText = provideText(locationData.locality, locationTextStack, textFormat.smallTemp)
    locationTextStack.setPadding(padding, padding, padding, padding)
  }

  // Show the current condition symbol.
  let mainConditionStack = align(currentWeatherStack)
  let mainCondition = mainConditionStack.addImage(provideConditionSymbol(weatherData.currentCondition,isNight(currentDate)))
  mainCondition.imageSize = new Size(22,22)
  mainConditionStack.setPadding(weatherSettings.showLocation ? 0 : padding, padding, 0, padding)
  
  // If we're showing the description, add it.
  if (weatherSettings.showCondition) {
    let conditionTextStack = align(currentWeatherStack)
    let conditionText = provideText(weatherData.currentDescription, conditionTextStack, textFormat.smallTemp)
    conditionTextStack.setPadding(padding, padding, 0, padding)
  }

  // Show the current temperature.
  const tempStack = align(currentWeatherStack)
  tempStack.setPadding(0, padding, 0, padding)
  const tempText = Math.round(weatherData.currentTemp) + "°"
  const temp = provideText(tempText, tempStack, textFormat.largeTemp)
  
  // If we're not showing the high and low, end it here.
  if (!weatherSettings.showHighLow) { return }

  // Show the temp bar and high/low values.
  let tempBarStack = align(currentWeatherStack)
  tempBarStack.layoutVertically()
  tempBarStack.setPadding(0, padding, padding, padding)
  
  let tempBar = drawTempBar()
  let tempBarImage = tempBarStack.addImage(tempBar)
  tempBarImage.size = new Size(50,0)
  
  tempBarStack.addSpacer(1)
  
  let highLowStack = tempBarStack.addStack()
  highLowStack.layoutHorizontally()
  
  const mainLowText = Math.round(weatherData.todayLow).toString()
  const mainLow = provideText(mainLowText, highLowStack, textFormat.tinyTemp)
  highLowStack.addSpacer()
  const mainHighText = Math.round(weatherData.todayHigh).toString()
  const mainHigh = provideText(mainHighText, highLowStack, textFormat.tinyTemp)
  
  tempBarStack.size = new Size(60,30)
}

// Display upcoming weather.
async function future(column) {

  // Requirements: weather and sunrise
  if (!weatherData) { await setupWeather() }
  if (!sunData) { await setupSunrise() }

  // Set up the future weather stack.
  let futureWeatherStack = column.addStack()
  futureWeatherStack.layoutVertically()
  futureWeatherStack.setPadding(0, 0, 0, 0)
  futureWeatherStack.url = "https://weather.com/weather/tenday/l/" + locationData.latitude + "," + locationData.longitude

  // Determine if we should show the next hour.
  const showNextHour = (currentDate.getHours() < weatherSettings.tomorrowShownAtHour)
  
  // Set the label value.
  const subLabelStack = align(futureWeatherStack)
  const subLabelText = showNextHour ? localizedText.nextHourLabel : localizedText.tomorrowLabel
  const subLabel = provideText(subLabelText, subLabelStack, textFormat.smallTemp)
  subLabelStack.setPadding(0, padding, padding/2, padding)
  
  // Set up the sub condition stack.
  let subConditionStack = align(futureWeatherStack)
  subConditionStack.layoutHorizontally()
  subConditionStack.centerAlignContent()
  subConditionStack.setPadding(0, padding, padding, padding)
  
  // Determine if it will be night in the next hour.
  var nightCondition
  if (showNextHour) {
    const addHour = currentDate.getTime() + (60*60*1000)
    const newDate = new Date(addHour)
    nightCondition = isNight(newDate)
  } else {
    nightCondition = false 
  }
  
  let subCondition = subConditionStack.addImage(provideConditionSymbol(showNextHour ? weatherData.nextHourCondition : weatherData.tomorrowCondition,nightCondition))
  const subConditionSize = showNextHour ? 14 : 18
  subCondition.imageSize = new Size(subConditionSize, subConditionSize)
  subConditionStack.addSpacer(5)
  
  // The next part of the display changes significantly for next hour vs tomorrow.
  if (showNextHour) {
    const subTempText = Math.round(weatherData.nextHourTemp) + "°"
    const subTemp = provideText(subTempText, subConditionStack, textFormat.smallTemp)
    
  } else {
    let tomorrowLine = subConditionStack.addImage(drawVerticalLine(new Color("ffffff", 0.5), 20))
    tomorrowLine.imageSize = new Size(3,28)
    subConditionStack.addSpacer(5)
    let tomorrowStack = subConditionStack.addStack()
    tomorrowStack.layoutVertically()
    
    const tomorrowHighText = Math.round(weatherData.tomorrowHigh) + ""
    const tomorrowHigh = provideText(tomorrowHighText, tomorrowStack, textFormat.tinyTemp)
    tomorrowStack.addSpacer(4)
    const tomorrowLowText = Math.round(weatherData.tomorrowLow) + ""
    const tomorrowLow = provideText(tomorrowLowText, tomorrowStack, textFormat.tinyTemp)
  }
}

// Return a text-creation function.
function text(input = null) {

  function displayText(column) {
  
    // Don't do anything if the input is blank.
    if (!input || input == "") { return }
  
    // Otherwise, add the text.
    const textStack = align(column)
    textStack.setPadding(padding, padding, padding, padding)
    const textDisplay = provideText(input, textStack, textFormat.customText)
  }
  return displayText
}

// Add a battery element to the widget; consisting of a battery icon and percentage.
async function battery(column) {

  // Get battery level via Scriptable function and format it in a convenient way
  function getBatteryLevel() {
  
    const batteryLevel = Device.batteryLevel()
    const batteryPercentage = `${Math.round(batteryLevel * 100)}%`

    return batteryPercentage
  }
  
  const batteryLevel = Device.batteryLevel()
  
  // Set up the battery level item
  let batteryStack = align(column)
  batteryStack.layoutHorizontally()
  batteryStack.centerAlignContent()

  let batteryIcon = batteryStack.addImage(provideBatteryIcon())
  batteryIcon.imageSize = new Size(30,30)
  
  // Change the battery icon to red if battery level is <= 20 to match system behavior
  if ( Math.round(batteryLevel * 100) > 20 || Device.isCharging() ) {

    batteryIcon.tintColor = new Color(textFormat.battery.color || textFormat.defaultText.color)

  } else {

    batteryIcon.tintColor = Color.red()

  }

  batteryStack.addSpacer(padding * 0.6)

  // Display the battery status
  let batteryInfo = provideText(getBatteryLevel(), batteryStack, textFormat.battery)

  batteryStack.setPadding(padding/2, padding, padding/2, padding)

}

// Show the sunrise or sunset time.
async function sunrise(column) {
  
  // Requirements: sunrise
  if (!sunData) { await setupSunrise() }
  
  const sunrise = sunData.sunrise
  const sunset = sunData.sunset
  const showWithin = sunriseSettings.showWithin
  const closeToSunrise = closeTo(sunrise) <= showWithin
  const closeToSunset = closeTo(sunset) <= showWithin

  // If we only show sometimes and we're not close, return.
  if (showWithin > 0 && !closeToSunrise && !closeToSunset) { return }
  
  // Otherwise, determine which time to show.
  const showSunrise = closeTo(sunrise) <= closeTo(sunset)
  
  // Set up the stack.
  const sunriseStack = align(column)
  sunriseStack.setPadding(padding/2, padding, padding/2, padding)
  sunriseStack.layoutHorizontally()
  sunriseStack.centerAlignContent()
  
  sunriseStack.addSpacer(padding * 0.3)
  
  // Add the correct symbol.
  const symbolName = showSunrise ? "sunrise.fill" : "sunset.fill"
  const symbol = sunriseStack.addImage(SFSymbol.named(symbolName).image)
  symbol.imageSize = new Size(22,22)
  
  sunriseStack.addSpacer(padding)
  
  // Add the time.
  const timeText = formatTime(showSunrise ? new Date(sunrise) : new Date(sunset))
  const time = provideText(timeText, sunriseStack, textFormat.sunrise)
}

// Allow for either term to be used.
async function sunset(column) {
  return await sunrise(column)
}

/*
 * HELPER FUNCTIONS
 * These functions perform duties for other functions.
 * ===================================================
 */

// Determines if the provided date is at night.
function isNight(dateInput) {
  const timeValue = dateInput.getTime()
  return (timeValue < sunData.sunrise) || (timeValue > sunData.sunset)
}

// Determines if two dates occur on the same day
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

// Returns the number of minutes between now and the provided date.
function closeTo(time) {
  return Math.abs(currentDate.getTime() - time) / 60000
}

// Format the time for a Date input.
function formatTime(date) {
  let df = new DateFormatter()
  df.locale = locale
  df.useNoDateStyle()
  df.useShortTimeStyle()
  return df.string(date)
}

// Provide a text symbol with the specified shape.
function provideTextSymbol(shape) {

  // Rectangle character.
  if (shape.startsWith("rect")) {
    return "\u2759"
  }
  // Circle character.
  if (shape == "circle") {
    return "\u2B24"
  }
  // Default to the rectangle.
  return "\u2759" 
}

// Provide a battery SFSymbol with accurate level drawn on top of it.
function provideBatteryIcon() {
  
  // If we're charging, show the charging icon.
  if (Device.isCharging()) { return SFSymbol.named("battery.100.bolt").image }
  
  // Set the size of the battery icon.
  const batteryWidth = 87
  const batteryHeight = 41
  
  // Start our draw context.
  let draw = new DrawContext()
  draw.opaque = false
  draw.respectScreenScale = true
  draw.size = new Size(batteryWidth, batteryHeight)
  
  // Draw the battery.
  draw.drawImageInRect(SFSymbol.named("battery.0").image, new Rect(0, 0, batteryWidth, batteryHeight))
  
  // Match the battery level values to the SFSymbol.
  const x = batteryWidth*0.1525
  const y = batteryHeight*0.247
  const width = batteryWidth*0.602
  const height = batteryHeight*0.505
  
  // Prevent unreadable icons.
  let level = Device.batteryLevel()
  if (level < 0.05) { level = 0.05 }
  
  // Determine the width and radius of the battery level.
  const current = width * level
  let radius = height/6.5
  
  // When it gets low, adjust the radius to match.
  if (current < (radius * 2)) { radius = current / 2 }

  // Make the path for the battery level.
  let barPath = new Path()
  barPath.addRoundedRect(new Rect(x, y, current, height), radius, radius)
  draw.addPath(barPath)
  draw.setFillColor(Color.black())
  draw.fillPath()
  return draw.getImage()
}

// Provide a symbol based on the condition.
function provideConditionSymbol(cond,night) {
  
  // Define our symbol equivalencies.
  let symbols = {
  
    // Thunderstorm
    "2": function() { return "cloud.bolt.rain.fill" },
    
    // Drizzle
    "3": function() { return "cloud.drizzle.fill" },
    
    // Rain
    "5": function() { return (cond == 511) ? "cloud.sleet.fill" : "cloud.rain.fill" },
    
    // Snow
    "6": function() { return (cond >= 611 && cond <= 613) ? "cloud.snow.fill" : "snow" },
    
    // Atmosphere
    "7": function() {
      if (cond == 781) { return "tornado" }
      if (cond == 701 || cond == 741) { return "cloud.fog.fill" }
      return night ? "cloud.fog.fill" : "sun.haze.fill"
    },
    
    // Clear and clouds
    "8": function() {
      if (cond == 800 || cond == 801) { return night ? "moon.stars.fill" : "sun.max.fill" }
      if (cond == 802 || cond == 803) { return night ? "cloud.moon.fill" : "cloud.sun.fill" }
      return "cloud.fill"
    }
  }
  
  // Find out the first digit.
  let conditionDigit = Math.floor(cond / 100)
  
  // Get the symbol.
  return SFSymbol.named(symbols[conditionDigit]()).image
}

// Provide a font based on the input.
function provideFont(fontName, fontSize) {
  const fontGenerator = {
    "ultralight": function() { return Font.ultraLightSystemFont(fontSize) },
    "light": function() { return Font.lightSystemFont(fontSize) },
    "regular": function() { return Font.regularSystemFont(fontSize) },
    "medium": function() { return Font.mediumSystemFont(fontSize) },
    "semibold": function() { return Font.semiboldSystemFont(fontSize) },
    "bold": function() { return Font.boldSystemFont(fontSize) },
    "heavy": function() { return Font.heavySystemFont(fontSize) },
    "black": function() { return Font.blackSystemFont(fontSize) },
    "italic": function() { return Font.italicSystemFont(fontSize) }
  }
  
  const systemFont = fontGenerator[fontName]
  if (systemFont) { return systemFont() }
  return new Font(fontName, fontSize)
}
 
// Add formatted text to a container.
function provideText(string, container, format) {
  const textItem = container.addText(string)
  const textFont = format.font || textFormat.defaultText.font
  const textSize = format.size || textFormat.defaultText.size
  const textColor = format.color || textFormat.defaultText.color
  
  textItem.font = provideFont(textFont, textSize)
  textItem.textColor = new Color(textColor)
  return textItem
}

/*
 * DRAWING FUNCTIONS
 * These functions draw onto a canvas.
 * ===================================
 */

// Draw the vertical line in the tomorrow view.
function drawVerticalLine(color, height) {
  
  const width = 2
  
  let draw = new DrawContext()
  draw.opaque = false
  draw.respectScreenScale = true
  draw.size = new Size(width,height)
  
  let barPath = new Path()
  const barHeight = height
  barPath.addRoundedRect(new Rect(0, 0, width, height), width/2, width/2)
  draw.addPath(barPath)
  draw.setFillColor(color)
  draw.fillPath()
  
  return draw.getImage()
}

// Draw the temp bar.
function drawTempBar() {

  // Set the size of the temp bar.
  const tempBarWidth = 200
  const tempBarHeight = 20
  
  // Calculate the current percentage of the high-low range.
  let percent = (weatherData.currentTemp - weatherData.todayLow) / (weatherData.todayHigh - weatherData.todayLow)

  // If we're out of bounds, clip it.
  if (percent < 0) {
    percent = 0
  } else if (percent > 1) {
    percent = 1
  }

  // Determine the scaled x-value for the current temp.
  const currPosition = (tempBarWidth - tempBarHeight) * percent

  // Start our draw context.
  let draw = new DrawContext()
  draw.opaque = false
  draw.respectScreenScale = true
  draw.size = new Size(tempBarWidth, tempBarHeight)

  // Make the path for the bar.
  let barPath = new Path()
  const barHeight = tempBarHeight - 10
  barPath.addRoundedRect(new Rect(0, 5, tempBarWidth, barHeight), barHeight / 2, barHeight / 2)
  draw.addPath(barPath)
  draw.setFillColor(new Color("ffffff", 0.5))
  draw.fillPath()

  // Make the path for the current temp indicator.
  let currPath = new Path()
  currPath.addEllipse(new Rect(currPosition, 0, tempBarHeight, tempBarHeight))
  draw.addPath(currPath)
  draw.setFillColor(new Color("ffffff", 1))
  draw.fillPath()

  return draw.getImage()
}