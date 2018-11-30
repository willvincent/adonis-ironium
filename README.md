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

The only real limitation, other than job payload size, which is dictated by the queue backend:
- AWS and IronMQ: 256k
- beanstalkd: 64k by default, but configurable

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

### Thanks
Heavily inspired by [Adonis Kue](https://github.com/nrempel/adonis-kue), thanks [Nick Rempel](https://github.com/nrempel) for that!

Also to [Harminder Virk](http://github.com/thetutlage) for creating [Adonis](https://adonisjs.com/).
