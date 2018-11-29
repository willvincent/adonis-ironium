'use strict'

/*
 * adonis-ironium
 *
 * (c) Will Vincent <will@willvincent.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')

module.exports = async function (cli) {
  await cli.command.copy(
    path.join(__dirname, './templates/ironium.js'),
    cli.helpers.configPath()
  )
}
