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
const fs = require('fs')

module.exports = async function (cli) {
  fs.copyFile(path.join(__dirname, './templates/ironium.js'), path.join(cli.helpers.configPath(), './ironium.js'))
}
