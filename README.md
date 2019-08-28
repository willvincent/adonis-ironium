# Adonis Ironium

An [Ironium](https://github.com/assaf/ironium) provider for the Adonis 4.x framework.

Easy integration of job queues backed by beanstalkd, ironMQ, and Amazon SQS

## Installation & Configuration

See [instructions.md](instructions.md)

```
adonis install adonis-ironium
```

## Usage

### Command List
Command                  | Description
:------------------------|:-----------
 `adonis make:job`       | Make a new Job Queue
 `adonis ironium:listen` | Start the queue listener

### Creating your first job queue

At it's most basic, a job queue provides an async `handle` method that job data is passed into, upon which it
operates.  This could be anything from simply the user id for a new user we want to send a welcome email,
or a collection of data needing further processing that doesn't make sense to occur during a regular
user request. 

The `handle` method is the only requirement! 

| Name        | Required | Type      | Static | Description                                           |
|-------------|----------|-----------|--------|-------------------------------------------------------|
| handle      | true     | function  | false  | An async function that is called for this job.        |

[Here's an example.](examples/app/Jobs/Example.js)

The only real limitation is job payload size, which is dictated by the queue backend:
- AWS and IronMQ: 256k
- beanstalkd: 64k by default, but configurable

**NOTE:**

`adonis make:job MyQueue` will create a job class in `app/Jobs`, these are automatically registered and accessibly simply by specifying the class name as the queue name when dispatching a job.

ie: `ironium.dispatch('MyQueue', { payload_data: 'goes here' })`

### Dispatching jobs

Dispatching jobs is pretty straightforward...

```javascript
const ironium = use('Ironium')
const queueName = 'Example'
const job = {
  message: 'This is my test job!'
}

const jobID = ironium.dispatch(queueName, job)
```

It will return a job ID, and process your job behind the scenes. 

You can also pass in an array of jobs, and optionally specify a delay in a format parsable by [ms](https://github.com/zeit/ms):

```javascript
const ironium = use('Ironium')
const queueName = 'Example'
const delay = '2hr'
const job = {
  message: 'This is my test job!'
}

const jobID = ironium.dispatch(queueName, job, delay)
```

```javascript
const ironium = use('Ironium')
const queueName = 'Example'

const jobs = [
  { message: 'This is my test job!' },
  { message: 'Another test job!' },
]

const jobID = ironium.dispatch(queueName, jobs)
```

## Reminder
Queued jobs won't process until you fire up one or more queue workers with the `ironium:listen` command.


## Important Note

If you wish to dispatch jobs from _within_ jobs, `use` does not appear to behave as one might expect,
so instead you should use `ioc.make()` like so:

```
const { ioc } = require('@adonisjs/fold')

class Example {
  async handle (job) {
    const Ironium = ioc.make('Ironium')
    const Logger = ioc.make('Logger')

    const jobId = await Ironium.dispatch('AnotherJob', anotherPayload)
    Logger.info('Dispatching Job(s): ', jobId)

    return
  }
}
```

### Thanks
Heavily inspired by [Adonis Kue](https://github.com/nrempel/adonis-kue), thanks [Nick Rempel](https://github.com/nrempel) for that!

Also to [Harminder Virk](http://github.com/thetutlage) for creating [Adonis](https://adonisjs.com/).
