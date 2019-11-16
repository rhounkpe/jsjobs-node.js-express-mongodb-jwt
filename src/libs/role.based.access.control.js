'use strict';

const rolesPermissions = require('../company/company.role.permissions.factory');

function RBAC() {
}

RBAC.prototype = {
  check: function (user) {
    this.currentUser = user;

    return new Context(this.currentUser);
  }
};

function Context(user) {
  this.user = user;
}

Context.prototype.is = function (role, cb) {
  try {
    if (!role) {
      return cb("no role provided", false);
    }

    if (!this.user || !this.user.roles) {
      return cb(null, false);
    }
    const user = this.user;
    const userInRole = user.roles.filter(r => r === role);

    if (userInRole) {
      if (cb) {
        cb(null, true);
      } else {
        const rolePermissions = rolesPermissions.filter(rp => rp.name === role) || [];
        const permissions = rolePermissions.reduce((a, b) => b.perms, []);
        return new PermissionsContext(true, permissions);
      }
    } else {
      if (cb) {
        cb(null, false);
      } else {
        return new PermissionsContext(false, null, null);
      }
    }
  } catch (err) {
    if (cb) {
      cb(err, false);
    }
    throw err;
  }
};

function PermissionsContext(currentResults, permissions) {
  this.results = currentResults;
  this.permissions = permissions;
}

PermissionsContext.prototype.can = function (perm, cb) {
  const permissions = this.permissions;
  if (!this.permissions || !this.permissions.length) {
    cb("No role permissions exists", false);
  }

  if (!this.results) {
    cb(null, false);
  }
  const permission = permissions.find(p => p === perm);

  if (permission) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = RBAC;
